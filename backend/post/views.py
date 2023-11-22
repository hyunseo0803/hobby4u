from django.shortcuts import render
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.db.models import Q
from urllib.parse import unquote
import hashlib
import random
import json
import jwt
import os
import requests
from .models import *
from django.core.files import File
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Class, DayClassinfo
from datetime import datetime
from django.utils import timezone
from datetime import timedelta
import base64
import uuid

from django.core import serializers

from dotenv import load_dotenv

load_dotenv()
import firebase_admin
from firebase_admin import credentials, storage
from django.http import JsonResponse
from apscheduler.schedulers.background import BackgroundScheduler
sched = BackgroundScheduler()

# cred = credentials.Certificate('C:\\Users\\hyunseo\\Hobby4U\\hobby4u\\firebase_sdk.json')
# firebase_admin.initialize_app(cred, {'storageBucket': 'hivehobby.appspot.com'})


SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')
ALGORITHM = os.getenv('DJANGO_JWT_ALGORITHM')
toss_payments_api_key=os.getenv('toss_payments_api_key')

from django.utils.dateformat import DateFormat

@sched.scheduled_job('cron',minute= '*',name = 'schedulerF')
def schedulerF():   
    print("task 체크중...")
    target_results = ExamResult.objects.filter(result='P',class_id__applyend__lt=timezone.now())
    if target_results:
        for result in target_results:
            # 수강하는 수강생 수
            refund_cnt=result.class_id
            if refund_cnt.applycnt > 0:
                
                # 해당 클래스의 (원금 - 원금 / 수강자 수) 만큼 돈을 반환
                refund_amount = float(refund_cnt.money) -( float(refund_cnt.money) /refund_cnt.applycnt)
                refund_member=Apply.objects.filter(class_id=refund_cnt.class_id)
                
                
                for m_refund in refund_member:
                    m_re = Member.objects.get(id=m_refund.id.id)
                    if Cashback.objects.filter(id=m_re.id,class_id=refund_cnt.class_id,cash=refund_amount).count()==0:
                        print("반환금 새로 추가할거임")
                        m_re.receive_cash+=refund_amount
                        m_re.save()
                        cash_back=Cashback(id=Member.objects.get(id=m_re.id),class_id=Class.objects.get(class_id=refund_cnt.class_id),cash=refund_amount,status='지급예정')
                        cash_back.save()
                    else:
                        print("이미 반환금으로 추가된거임")
                        return;
sched.start()

def randm_num():
    num = "0123456789"
 
    result=""
    for i in range(4):
        result+=random.choice(num)
        
    return result
    

def generate_random_hash(file_name):
    
    # print(file_name)
 
    # 임의의 솔트(salt)를 생성
    file_name_without_extension, file_extension = file_name.rsplit('.', 1)

    # 파일 이름을 해시화
    hashed_file_name = hashlib.sha256(file_name_without_extension.encode()).hexdigest()

    # 해싱된 파일 이름과 확장자 결합
    hashed = f"{hashed_file_name}{randm_num()}.{file_extension}"
    return hashed

def upload_to_firebase(file,folder_name):
    # Firebase 스토리지에 파일 업로드
    if file is not None:
        bucket = storage.bucket()
        filename=generate_random_hash(file.name)
        
        blob = bucket.blob(folder_name+'/'+filename)
        blob.upload_from_file(file)
    
        return filename
    else:
        return None
    
@csrf_exempt
def submit_data(request):
    if request.method == 'POST':
        json_data = request.POST.get('json')  # JSON 데이터 받기
        
    
        data = json.loads(json_data)
        
        token=data.get('token')
        payload = jwt.decode(token,SECRET_KEY,ALGORITHM)
        user_id=payload['id']
        
        date= datetime.now().date()
        title=data.get('title')
        person = data.get('person')
        info = data.get('info')
        option = data.get('option')
        imageSrc=request.FILES.get("imageSrc")
        address = data.get('address')
        money = data.get('money')
        theme = data.get('theme')
        applyenddate=data.get('applyEndDate')
        activitystartdate=data.get('activityStartDate')
        activityenddate=data.get('activityEndDate')
        inputinfo1=data.get('inputInfo1')
        inputinfo2=data.get('inputInfo2')
        inputinfo3=data.get('inputInfo3')
        inputimage1=request.FILES.get('inputImage1')
        inputimage2=request.FILES.get('inputImage2')
        inputimage3=request.FILES.get('inputImage3')
        file=request.FILES.get('file')
        
        # print(activityenddate,activitystartdate)
        
        
            
            
        days = data.get('days', [])
        
        imageSrc_file_url = upload_to_firebase(imageSrc,"classFile")
        inputimage1_file_url = upload_to_firebase(inputimage1,"intro")
        inputimg2_file_url = upload_to_firebase(inputimage2,"intro")
        inputimg3_file_url = upload_to_firebase(inputimage3,"intro")
        class_file_url=upload_to_firebase(file,"file")

        class_obj = Class.objects.create(
                                            id=Member.objects.get(pk=user_id),
                                            title=title,
                                            info=info,
                                            date=date,
                                            img=imageSrc_file_url,
                                            theme=theme,
                                            people=person,
                                            money=money,
                                            type=option,
                                            intro1_file=inputimage1_file_url,
                                            intro1_content=inputinfo1,
                                            intro2_file=inputimg2_file_url,
                                            intro2_content=inputinfo2,
                                            intro3_file=inputimg3_file_url,
                                            intro3_content=inputinfo3,
                                            applyend=applyenddate,
                                            activitystart=activitystartdate ,
                                            activityend=activityenddate ,
                                            adress=address,
                                            file=class_file_url)
        class_obj.save()
        for day_data in days:
                day_sequence=day_data.get('id','')
                day_date=day_data.get('date','')
                day_title = day_data.get('title','')
                day_info = day_data.get('content','')
                day_file = request.FILES.get(f'dayImg[{day_sequence}]', None)
                # print(day_date)
                day_file_url = upload_to_firebase(day_file,"day")

                day_class_info=DayClassinfo.objects.create(
                    class_id=class_obj,
                    sequence=day_sequence,
                    date=day_date,
                    title=day_title, 
                    info=day_info,
                    file=day_file_url
                    )
            
                day_class_info.save()
        return JsonResponse({'message': 'Data received and processed successfully!'})

    return JsonResponse({'error': 'Invalid request method.'}, status=400)



def read_all_data(request):
    today= datetime.today().strftime('%Y-%m-%d')
    class_all = ExamResult.objects.filter(result='P',class_id__applyend__gte=today)
    
    
    all_data_list = []
    for all in class_all:
        all_data = {
            'class_id': all.class_id.class_id,
            'id':{
                'nickname':all.class_id.id.nickname,
                'profile':all.class_id.id.profileimg if all.class_id.id.profileimg else None,
                'updateprofile':all.class_id.id.updateprofile if all.class_id.id.updateprofile else None,
            },
            'title': all.class_id.title,
            'info': all.class_id.info,
            'img': all.class_id.img,
            'theme': all.class_id.theme,
            'people': all.class_id.people,
            'money': all.class_id.money,
            'type': all.class_id.type,
            'applyend': all.class_id.applyend,
            'activitystart': all.class_id.activitystart,
            'activityend': all.class_id.activityend,
            'goodCount': all.class_id.goodcount,
            'applycnt': all.class_id.applycnt,
        }
        all_data_list.append(all_data)
        
    return JsonResponse({'all_data_list':all_data_list}, safe=False)

# @csrf_exempt
def read_my_data(request):
        jwt_token = request.headers.get('Authorization').split(' ')[1]
        payload = jwt.decode(jwt_token,SECRET_KEY,ALGORITHM)
        user_id=payload['id']
        
        
        class_all = ExamResult.objects.filter(result='P')
        
        if class_all.count()>0:
            class_my = class_all.filter(class_id__id=user_id)
            
            my_data_list = []
            for all in class_my:
                all_data = {
                    'class_id': all.class_id.class_id,
                    'id':{
                        'nickname':all.class_id.id.nickname,
                        'profile':all.class_id.id.profileimg if all.class_id.id.profileimg else None,
                        'updateprofile':all.class_id.id.updateprofile if all.class_id.id.updateprofile else None,
                    },
                    'title': all.class_id.title,
                    'info': all.class_id.info,
                    'img': all.class_id.img,
                    'theme': all.class_id.theme,
                    'people': all.class_id.people,
                    'money': all.class_id.money,
                    'type': all.class_id.type,
                    'applyend': all.class_id.applyend,
                    'activitystart': all.class_id.activitystart,
                    'activityend': all.class_id.activityend,
                    'goodCount': all.class_id.goodcount
                }
                my_data_list.append(all_data)
                
        class_apply=Apply.objects.filter(id=user_id)
        my_apply_list=[]
        print("내가 신청한거")
        print(class_apply)
        if class_apply.count()>0:    
            for apply in class_apply:
                all_data = {
                    'class_id': apply.class_id.class_id,
                    'id':{
                        'nickname':apply.class_id.id.nickname,
                        'profile':apply.class_id.id.profileimg if apply.class_id.id.profileimg else None,
                        'updateprofile':apply.class_id.id.updateprofile if apply.class_id.id.updateprofile else None,
                    },
                    'title': apply.class_id.title,
                    'info': apply.class_id.info,
                    'img': apply.class_id.img,
                    'theme': apply.class_id.theme,
                    'people': apply.class_id.people,
                    'money': apply.class_id.money,
                    'type': apply.class_id.type,
                    'applyend': apply.class_id.applyend,
                    'activitystart': apply.class_id.activitystart,
                    'activityend': apply.class_id.activityend,
                    'goodCount': apply.class_id.goodcount
                }
                my_apply_list.append(all_data)
            
        return JsonResponse({'my_data_list':my_data_list,'my_apply_list':my_apply_list})

@csrf_exempt
def read_judge_my(request):
    if request.method =="POST":
        jwt_token = request.headers.get('Authorization').split(' ')[1]
        payload = jwt.decode(jwt_token,SECRET_KEY,ALGORITHM)
        user_id=payload['id']
        class_all = Class.objects.all()
        judge_class = class_all.exclude(class_id__in=ExamResult.objects.values('class_id'))
        judge_my=judge_class.filter(id=user_id)
        judge_data_list = []
        for judge in judge_my:
            all_data = {
                'class_id': judge.class_id,
                'id':{
                    'nickname':judge.id.nickname,
                    'profile':judge.id.profileimg if judge.id.profileimg else None,
                    'updateprofile':judge.id.updateprofile if judge.id.updateprofile else None,
                },
                'title': judge.title,
                'info': judge.info,
                'img': judge.img,
                'theme': judge.theme,
                'people': judge.people,
                'money': judge.money,
                'type': judge.type,
                'applyend': judge.applyend,
                'activitystart': judge.activitystart,
                'activityend': judge.activityend,
                'goodCount': judge.goodcount
            }
            judge_data_list.append(all_data)
        
    return JsonResponse({'judge_data_list':judge_data_list}, safe=False)

@csrf_exempt
def read_judge_np(request):
    if request.method =="POST":
        jwt_token = request.headers.get('Authorization').split(' ')[1]
        payload = jwt.decode(jwt_token,SECRET_KEY,ALGORITHM)
        user_id=payload['id']
        judge_class = ExamResult.objects.filter(result='NP')
        judge_my=judge_class.filter(class_id__id=user_id)
        judge_np_list = []
        for judge in judge_my:
            all_data = {
                'class_id': judge.class_id.class_id,
                'id':{
                    'nickname':judge.class_id.id.nickname,
                    'profile':judge.class_id.id.profileimg if judge.class_id.id.profileimg else None,
                    'updateprofile':judge.class_id.id.updateprofile if judge.class_id.id.updateprofile else None,
                },
                'title': judge.class_id.title,
                'info': judge.class_id.info,
                'img': judge.class_id.img,
                'theme': judge.class_id.theme,
                'people': judge.class_id.people,
                'money': judge.class_id.money,
                'type': judge.class_id.type,
                'applyend': judge.class_id.applyend,
                'activitystart': judge.class_id.activitystart,
                'activityend': judge.class_id.activityend,
                'goodCount': judge.class_id.goodcount
            }
            judge_np_list.append(all_data)
        
    return JsonResponse({'judge_np_list':judge_np_list})




def read_new_data(request):
    
    current_date = datetime.now().date()
    today= datetime.today().strftime('%Y-%m-%d')

    one_month_ago = current_date - timedelta(days=15)
    exam_result=ExamResult.objects.filter(result='P',class_id__applyend__gte=today)
    
    filtered_date = exam_result.filter(date__range=[one_month_ago, current_date])
    new_date_list=[]
    for date in filtered_date:
        date_data={
            'class_id': date.class_id.class_id,
            'title': date.class_id.title,
            'info': date.class_id.info,
            'img': date.class_id.img,
            'theme':date.class_id.theme,
            'people': date.class_id.people,
            'money': date.class_id.money,
            'type': date.class_id.type,
            'applyend': date.class_id.applyend,
            'activitystart': date.class_id.activitystart,
            'activityend': date.class_id.activityend,
            'goodCount': date.class_id.goodcount,
            'applycnt': date.class_id.applycnt,
            'id':{
                'nickname':date.class_id.id.nickname,
                'profile':date.class_id.id.profileimg if date.class_id.id.profileimg else None,
                'updateprofile':date.class_id.id.updateprofile if date.class_id.id.updateprofile else None,
            }
        }
        new_date_list.append(date_data)
        

    return JsonResponse( {'new_date_list':new_date_list}, safe=False) 
            
@csrf_exempt
def read_some_data(request): 
    class_id = request.GET.get('class_id')
    if class_id is not None:
        try:
            
            cls = Class.objects.get(class_id=class_id)
            class_data = {
                'class_id': cls.class_id,
                'id':{
                    'nickname':cls.id.nickname,
                    'profile':cls.id.profileimg if cls.id.profileimg else None,
                    'updateprofile':cls.id.updateprofile if cls.id.updateprofile else None,
                },
                'date':cls.date,
                'title': cls.title,
                'info': cls.info,
                'img': cls.img if cls.img else None,
                'file': cls.file if cls.file else None,
                'theme':cls.theme,
                'people': cls.people,
                'money': cls.money,
                'type': cls.type,
                'address': cls.adress,
                'applyend': cls.applyend,
                'activitystart': cls.activitystart,
                'activityend': cls.activityend,
                'goodCount': cls.goodcount,
                'infoimg1':cls.intro1_file if cls.intro1_file else None,
                'infoimg2': cls.intro2_file if cls.intro2_file else None,
                'infoimg3': cls.intro3_file if cls.intro3_file else None, 
                'info1':cls.intro1_content,
                'info2':cls.intro2_content,
                'info3':cls.intro3_content,
                'applycnt':cls.applycnt
                
                
            }
            dls=DayClassinfo.objects.filter(class_id=class_id)
            day_data_list = []
            for day_ in dls:
                day_data = {
                    'day_file':day_.file,
                    'day_title': day_.title,
                    'day_info': day_.info,
                    'day_sequence':day_.sequence
                }
                day_data_list.append(day_data)
            return JsonResponse({'class_data':class_data,'day_data':day_data_list})
        except Class.DoesNotExist:
            return JsonResponse({'error': 'Class not found'}, status=404)
    else:
        return JsonResponse({'error': 'class_id parameter is required'}, status=400)

    
def read_filter_data(request):
    money = request.GET.get('money')
    option = request.GET.get('option')
    theme=request.GET.get('theme')
    incoding_word=request.GET.get('word')
    incoding_field=request.GET.get('searchfield')
    
    exams_with_result_p = ExamResult.objects.filter(result='P')

    class_ids_with_result_p = exams_with_result_p.values_list('class_id', flat=True)

    filter_result = Class.objects.filter(class_id__in=class_ids_with_result_p)

   
        
    if incoding_word is not None and unquote(incoding_field)=="제목":
        filter_result = filter_result.filter(title__contains=unquote(incoding_word))
    if incoding_word is not None and unquote(incoding_field)=="멘토":
        filter_result = filter_result.filter(Q(id__nickname__contains=unquote(incoding_word)))
    
    if theme is not None:
        for t in theme:
            filter_result = filter_result.filter(theme__contains=t)
        
    if money == "fee":
        filter_result = filter_result.exclude(money=0)
    if money == "free":
        filter_result = filter_result.filter(money=0)
        
    if option == "online":
        filter_result = filter_result.filter(type='online')
    if option == "offline":
        filter_result = filter_result.filter(type='offline')
    
    # 유료이면서 온라인
    if money == "fee" and option == "online":
        filter_result = filter_result.exclude(money=0).filter(type='online')

    # 무료이면서 온라인
    if money == "free" and option == "online":
        filter_result = filter_result.filter(money=0).filter(type='online')

    # 유료이면서 오프라인
    if money == "fee" and option == "offline":
        filter_result = filter_result.exclude(money=0).filter(type='offline')

    filter_data_list = []
    if filter_result.count()>0:
        for item in filter_result:
            filter_data = {
                'class_id': item.class_id,
                'id': {
                    'nickname':item.id.nickname,
                    'profile':item.id.profileimg if item.id.profileimg else None,
                    'updateprofile':item.id.updateprofile if item.id.updateprofile else None,
                    
                },
                'title': item.title,
                'info': item.info,
                'img': item.img,
                'theme': item.theme,
                'people': item.people,
                'money': item.money,
                'type': item.type,
                # 'applystart': item.applystart,
                'applyend': item.applyend,
                'activitystart': item.activitystart,
                'activityend': item.activityend,
                'goodCount': item.goodcount
            }
            filter_data_list.append(filter_data)
    return JsonResponse({'filter_data_list': filter_data_list}, safe=False)


@csrf_exempt
def create_goodCount_data(request):
        if request.method == 'POST':
            count_data = json.loads(request.body)
            class_id = count_data.get('classId')
            count_token=count_data.get('token')
            payload = jwt.decode(count_token,SECRET_KEY,ALGORITHM)
            user=payload['id']
            
            class_info = Class.objects.get(pk=class_id)

            # 좋아요 상태 확인
            if LikeClass.objects.filter(id=Member.objects.get(id=user), class_id= Class.objects.get(pk=class_id)).exists():
                # 이미 좋아요를 누른 경우, 좋아요 취소
                LikeClass.objects.filter(id=Member.objects.get(id=user), class_id= Class.objects.get(pk=class_id)).delete()
                class_info.goodcount-= 1
                class_info.save()
                liked = False
                
            else:
                # 좋아요 추가
                LikeClass.objects.create(id=Member.objects.get(id=user), class_id= Class.objects.get(pk=class_id))
                class_info.goodcount+= 1
                class_info.save()
                liked = True
            return JsonResponse({'liked':liked} ,safe=False)

        return JsonResponse({'message': 'Data received and processed successfully!'})

@csrf_exempt
def read_goodCount_data(request):
    if request.method == 'POST':
        count_data = json.loads(request.body)
        count_token = count_data.get('token')
        payload = jwt.decode(count_token, SECRET_KEY, ALGORITHM)
        user = payload['id']

        like_data = LikeClass.objects.filter(id=Member.objects.get(id=user)).values('class_id')
        like_data_list = list(like_data)

        return JsonResponse({'like_data_list': like_data_list}, safe=False)

    return JsonResponse({'message': 'Data received and processed successfully!'})


@csrf_exempt
def process_payment(request):
    if request.method=="POST":
        data=json.loads(request.body.decode('utf-8'))
        
        # print(request.body)

        toss_payments_api_key_bytes = f"{toss_payments_api_key}:".encode('utf-8')
        encoded_api_key = base64.b64encode(toss_payments_api_key_bytes).decode('utf-8')

        # toss_api_key = encoded_api_key
        toss_api_url = 'https://api.tosspayments.com/v1/payments/confirm'

        # 토스 페이먼츠 API 호출
        response = requests.post(
        toss_api_url,
        headers={
            'Authorization':  f'Basic {encoded_api_key}',
            'Content-Type': 'application/json',
            'idempotency_key' : str(uuid.uuid4())
        },
        json=data,
        )
        
        # print(response.status_code)

    return JsonResponse(response.json(), status=response.status_code)

@csrf_exempt
def apply_class(request):
    if request.method =="POST":
        data = json.loads(request.body.decode("utf-8"))
        token = data.get('token')
        classid=data.get('classid')
        payload = jwt.decode(token, SECRET_KEY, ALGORITHM)
        user = payload['id']
        
        apply=Apply(id=Member.objects.get(id=user),class_id=Class.objects.get(class_id=classid))
        apply.save()
        
        apply_up_cnt=Class.objects.get(class_id=classid)
        apply_up_cnt.applycnt += 1
        apply_up_cnt.save()

    return JsonResponse({'message': 'data saved successfully'})        
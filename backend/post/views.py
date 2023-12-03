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
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache


from django.core import serializers

from dotenv import load_dotenv

load_dotenv()
import firebase_admin
from firebase_admin import credentials, storage
from django.http import JsonResponse
from apscheduler.schedulers.background import BackgroundScheduler
sched = BackgroundScheduler()

from django.core.cache import cache


SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')
ALGORITHM = os.getenv('DJANGO_JWT_ALGORITHM')
toss_payments_api_key=os.getenv('toss_payments_api_key')

from django.utils.dateformat import DateFormat

@sched.scheduled_job('cron',minute= '*',name = 'schedulerF')
def schedulerF():   
    print("task 체크중...")
    target_results = ExamResult.objects.filter(result='P',class_id__applyend__lt=timezone.localdate())
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
                        print("반환금 새로 추가")
                        m_re.receive_cash+=refund_amount
                        m_re.save()
                        cash_back=Cashback(id=Member.objects.get(id=m_re.id),class_id=Class.objects.get(class_id=refund_cnt.class_id),cash=refund_amount,status='지급예정')
                        cash_back.save()
                    else:
                        print("이미 반환금으로 추가됨")
                        return;
sched.start()


# 모델에서 변경 사항을 감지하여 캐시를 갱신하는 함수
@receiver(post_save, sender=Class)
@receiver(post_delete, sender=Class)
def update_cache_on_data_change(sender, **kwargs):
    cache.clear()

def randm_num():
    num = "0123456789"
    result=""
    for i in range(4):
        result+=random.choice(num)
    return result
    

def generate_random_hash(file_name):
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
        json_data = request.POST.get('json')  
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

def extract_data_from_class(class_instance):
    data = {
        'class_id': class_instance.class_id.class_id,
        'id': {
            'nickname': class_instance.class_id.id.nickname,
            'profile': class_instance.class_id.id.profileimg if class_instance.class_id.id.profileimg else None,
            'updateprofile': class_instance.class_id.id.updateprofile if class_instance.class_id.id.updateprofile else None,
        },
        'title': class_instance.class_id.title,
        'info': class_instance.class_id.info,
        'img': class_instance.class_id.img,
        'theme': class_instance.class_id.theme,
        'people': class_instance.class_id.people,
        'money': class_instance.class_id.money,
        'type': class_instance.class_id.type,
        'applyend': class_instance.class_id.applyend,
        'activitystart': class_instance.class_id.activitystart,
        'activityend': class_instance.class_id.activityend,
        'goodCount': class_instance.class_id.goodcount
    }
    return data


def extract_data_from_classmodel(class_instance):
    data = {
        'class_id': class_instance.class_id,
        'id': {
            'nickname': class_instance.id.nickname,
            'profile': class_instance.id.profileimg if class_instance.id.profileimg else None,
            'updateprofile': class_instance.id.updateprofile if class_instance.id.updateprofile else None,
        },
        'title': class_instance.title,
        'info': class_instance.info,
        'img': class_instance.img,
        'theme': class_instance.theme,
        'people': class_instance.people,
        'money': class_instance.money,
        'type': class_instance.type,
        'applyend': class_instance.applyend,
        'activitystart': class_instance.activitystart,
        'activityend': class_instance.activityend,
        'goodCount': class_instance.goodcount
    }
    return data


def read_all_data(request):
    today= datetime.today().strftime('%Y-%m-%d')
    class_all = ExamResult.objects.filter(result='P',class_id__applyend__gte=today)
    
    all_data_list = [extract_data_from_class(all) for all in class_all]
    return JsonResponse({'all_data_list':all_data_list}, safe=False)

def read_my_class(request):
    jwt_token = request.headers.get('Authorization').split(' ')[1]
    payload = jwt.decode(jwt_token,SECRET_KEY,ALGORITHM)
    user_id=payload['id']
    p_class = ExamResult.objects.filter(result='P')
    my_p_class = p_class.filter(class_id__id=user_id)
    
    allclass_my=[]
    for my in my_p_class:
        data={
            'class_id':my.class_id.class_id
        }
        allclass_my.append(data)
    return JsonResponse({'allclass_my': allclass_my})

def read_my_data(request):
        jwt_token = request.headers.get('Authorization').split(' ')[1]
        payload = jwt.decode(jwt_token,SECRET_KEY,ALGORITHM)
        user_id=payload['id']
        
        filter = request.GET.get('filter')
        selectwhat=request.GET.get('selectwhat')
        
        today = timezone.localdate()
        thirty_one_days_ago = today - timedelta(days=31)
        
        class_all = ExamResult.objects.filter(result='P')
        
        if class_all.count()>0:
            class_my = class_all.filter(class_id__id=user_id)
            class_apply=Apply.objects.filter(id=user_id)
            
            #내 클래스/ 수강중인 클래스 전체
            my_data_list = [extract_data_from_class(all) for all in class_my]
            my_apply_list=[extract_data_from_class(apply) for apply in class_apply]
            
            #삭제 가능
            mydeleteok=class_my.filter(class_id__applyend__gte=today)
            #취소 가능
            applycancleok=class_apply.filter(class_id__applyend__gte=today)
            #내 클래스 삭제가능/ 수강중인 클래스 취소 가능
            my_delete_ok = [extract_data_from_class(befor) for befor in mydeleteok]
            apply_cancle_ok = [extract_data_from_class(befor) for befor in applycancleok]
            
            my_activity_filter = []
            apply_activity_filter = []
            c_m_o_list=class_my.none()
            c_m_v_list=class_my.none()
            c_p_o_list=class_apply.none()
            c_p_v_list=class_apply.none()
            
            if selectwhat=="myclass":
                if filter and filter == "before":
                    #활동 전 
                    c_m_o= class_my.filter(class_id__type="offline")
                    if c_m_o:
                        c_m_o_list=c_m_o.filter(class_id__activitystart__gt=today)
                    c_m_v= class_my.exclude(class_id__type="offline")
                    if c_m_v:
                        c_m_v_list=c_m_v.filter(class_id__applyend__gte=today)
                
                    my_activity_before=c_m_o_list.union(c_m_v_list)
                    my_activity_filter = [extract_data_from_class(befor) for befor in my_activity_before]
                    
                if filter and filter == "ing":
                    c_m_o= class_my.filter(class_id__type="offline")
                    if c_m_o:
                        c_m_o_list=c_m_o.filter(class_id__activitystart__lte=today, class_id__activityend__gte=today)
                    c_m_v= class_my.exclude(class_id__type="offline")
                    if c_m_v:    
                        c_m_v_list=c_m_v.filter(class_id__applyend__lt=today,class_id__applyend__gte=thirty_one_days_ago)
                        
                    my_activity_ing=c_m_o_list.union(c_m_v_list)
                    my_activity_filter = [extract_data_from_class(ing) for ing in my_activity_ing]
                elif filter and filter == "finish":
                    c_m_o= class_my.filter(class_id__type="offline")
                    if c_m_o:
                        c_m_o_list=c_m_o.filter(class_id__activityend__lt=today)
                    c_m_v= class_my.exclude(class_id__type="offline")
                    if c_m_v:
                        c_m_v_list=c_m_v.filter(class_id__applyend__lt=thirty_one_days_ago)
                    
                    my_activity_finish=c_m_o_list.union(c_m_v_list)
                    my_activity_filter = [extract_data_from_class(finish) for finish in my_activity_finish]
            elif selectwhat=="applyclass":
                if filter and filter == "before":
                    #활동 전 
                    c_p_o= class_apply.filter(class_id__type="offline")
                    if c_p_o:
                        c_p_o_list=c_p_o.filter(class_id__activitystart__gt=today)
                    c_p_v= class_apply.exclude(class_id__type="offline")
                    if c_p_v:
                        c_p_v_list=c_p_v.filter(class_id__applyend__gte=today)
                
                    apply_activity_before=c_p_o_list.union(c_p_v_list)
                    apply_activity_filter = [extract_data_from_class(befor) for befor in apply_activity_before]
                    
                if filter and filter == "ing":
                    c_p_o= class_apply.filter(class_id__type="offline")
                    if c_p_o:
                        c_p_o_list=c_p_o.filter(class_id__activitystart__lte=today, class_id__activityend__gte=today)
                    c_p_v= class_apply.exclude(class_id__type="offline")
                    if c_p_v:
                        c_p_v_list=c_p_v.filter(class_id__applyend__lt=today,class_id__applyend__gte=thirty_one_days_ago)

                    apply_activity_ing=c_p_o_list.union(c_p_v_list)
                    apply_activity_filter = [extract_data_from_class(ing) for ing in apply_activity_ing]
                    
                elif filter and filter == "finish":
                    c_p_o= class_apply.filter(class_id__type="offline")
                    if c_p_o:
                        c_p_o_list=c_p_o.filter(class_id__activityend__lt=today)
                    c_p_v= class_apply.exclude(class_id__type="offline")
                    if c_p_v:
                        c_p_v_list=c_p_v.filter(class_id__applyend__lt=thirty_one_days_ago)
                    
                    apply_activity_finish=c_p_o_list.union(c_p_v_list)
                    apply_activity_filter = [extract_data_from_class(finish) for finish in apply_activity_finish]
        return JsonResponse({'my_delete_ok':my_delete_ok,'apply_cancle_ok':apply_cancle_ok,'my_data_list':my_data_list,'my_apply_list':my_apply_list,'my_activity_filter':my_activity_filter,'apply_activity_filter':apply_activity_filter})

@csrf_exempt
def delete_my_class(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            class_id = data.get('class_id')
            deletemyclass = Class.objects.get(class_id=class_id)
            deletemyday=DayClassinfo.objects.filter(class_id=class_id)
            deleteexam=ExamResult.objects.filter(class_id=class_id)
            deleteapply=Apply.objects.filter(class_id=class_id)
            deletemyday.delete()
            deleteexam.delete()
            deleteapply.delete()
            deletemyclass.delete()
            return JsonResponse({'message': '클래스 삭제에 성공했습니다.'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'POST 메서드만 지원됩니다.'}, status=400)

@csrf_exempt
def cancle_apply_class(request):
    if request.method == 'POST':
        try:
            data=json.loads(request.body.decode('utf-8'))
            classid=data.get('class_id')
            token=data.get('token')
            payload = jwt.decode(token, SECRET_KEY, ALGORITHM)
            user = payload['id']
            
            deletemyclass=Apply.objects.get(class_id=classid,id=Member.objects.get(id=user))
            deletemyclass.delete()
            deletemyclasscnt=Class.objects.get(class_id=classid)
            deletemyclasscnt.applycnt-=1
            deletemyclasscnt.save()
            return JsonResponse({'message': '수강 취소에 성공했습니다.'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'message':'Delete my class'})

@csrf_exempt
def read_judge_my(request):
    if request.method =="POST":
        jwt_token = request.headers.get('Authorization').split(' ')[1]
        payload = jwt.decode(jwt_token,SECRET_KEY,ALGORITHM)
        user_id=payload['id']
        class_all = Class.objects.all()
        judge_class = class_all.exclude(class_id__in=ExamResult.objects.values('class_id'))
        judge_my=judge_class.filter(id=user_id)
        judge_data_list = [extract_data_from_classmodel(judge) for judge in judge_my]
    return JsonResponse({'judge_data_list':judge_data_list}, safe=False)

@csrf_exempt
def read_judge_np(request):
    if request.method =="POST":
        jwt_token = request.headers.get('Authorization').split(' ')[1]
        payload = jwt.decode(jwt_token,SECRET_KEY,ALGORITHM)
        user_id=payload['id']
        judge_np_class = ExamResult.objects.filter(result='NP')
        judge_my_np=judge_np_class.filter(class_id__id=user_id)
        judge_np_list = [extract_data_from_class(mynp) for mynp in judge_my_np]
    return JsonResponse({'judge_np_list':judge_np_list})




def read_new_data(request):
    current_date = datetime.now().date()
    today= datetime.today().strftime('%Y-%m-%d')

    one_month_ago = current_date - timedelta(days=15)
    exam_result=ExamResult.objects.filter(result='P',class_id__applyend__gte=today)
    
    filtered_date = exam_result.filter(date__range=[one_month_ago, current_date])
    new_date_list=[extract_data_from_class(new) for new in filtered_date]
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
                    'id':cls.id.id,
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
    
# 캐시 사용 전 
# def read_filter_data(request):
#     money = request.GET.get('money')
#     option = request.GET.get('option')
#     theme=request.GET.get('theme')
#     incoding_word=request.GET.get('word')
#     incoding_field=request.GET.get('searchfield')
    
#     exams_with_result_p = ExamResult.objects.filter(result='P')

#     class_ids_with_result_p = exams_with_result_p.values_list('class_id', flat=True)

#     filter_result = Class.objects.filter(class_id__in=class_ids_with_result_p)

   
        
#     if incoding_word is not None and unquote(incoding_field)=="제목":
#         filter_result = filter_result.filter(title__contains=unquote(incoding_word))
#     if incoding_word is not None and unquote(incoding_field)=="멘토":
#         filter_result = filter_result.filter(Q(id__nickname__contains=unquote(incoding_word)))
    
#     if theme is not None:
#         for t in theme:
#             filter_result = filter_result.filter(theme__contains=t)
        
#     if money == "fee":
#         filter_result = filter_result.exclude(money=0)
#     if money == "free":
#         filter_result = filter_result.filter(money=0)
        
#     if option == "online":
#         filter_result = filter_result.filter(type='online')
#     if option == "offline":
#         filter_result = filter_result.filter(type='offline')
    
#     # 유료이면서 온라인
#     if money == "fee" and option == "online":
#         filter_result = filter_result.exclude(money=0).filter(type='online')

#     # 무료이면서 온라인
#     if money == "free" and option == "online":
#         filter_result = filter_result.filter(money=0).filter(type='online')

#     # 유료이면서 오프라인
#     if money == "fee" and option == "offline":
#         filter_result = filter_result.exclude(money=0).filter(type='offline')

#     filter_data_list = []
#     if filter_result.count()>0:
#         for item in filter_result:
#             filter_data = {
#                 'class_id': item.class_id,
#                 'id': {
#                     'nickname':item.id.nickname,
#                     'profile':item.id.profileimg if item.id.profileimg else None,
#                     'updateprofile':item.id.updateprofile if item.id.updateprofile else None,
                    
#                 },
#                 'title': item.title,
#                 'info': item.info,
#                 'img': item.img,
#                 'theme': item.theme,
#                 'people': item.people,
#                 'money': item.money,
#                 'type': item.type,
#                 # 'applystart': item.applystart,
#                 'applyend': item.applyend,
#                 'activitystart': item.activitystart,
#                 'activityend': item.activityend,
#                 'goodCount': item.goodcount
#             }
#             filter_data_list.append(filter_data)
#     return JsonResponse({'filter_data_list': filter_data_list}, safe=False)

    
def read_filter_data(request):
    money = request.GET.get('money')
    option = request.GET.get('option')
    theme=request.GET.get('theme')
    
    incoding_word=request.GET.get('word')
    incoding_field=request.GET.get('searchfield')
    today = timezone.localdate()
    
    filter_data_list=[]

    
    if incoding_word is not None and unquote(incoding_field)=="제목":
        cache_key = f'search_title:{unquote(incoding_word)}'
        search_title = cache.get(cache_key)
        if search_title is not None:
            return JsonResponse({'filter_data_list': search_title}, safe=False)
        else:
            exams_with_result_p = ExamResult.objects.filter(result='P',class_id__applyend__gte=today)
            class_ids_with_result_p = exams_with_result_p.values_list('class_id', flat=True)
            filter_result = Class.objects.filter(class_id__in=class_ids_with_result_p)
            filter_result = filter_result.filter(title__contains=unquote(incoding_word))
    if incoding_word is not None and unquote(incoding_field)=="멘토":
        cache_key = f'search_mentor:{unquote(incoding_word)}'
        search_mentor = cache.get(cache_key)
        if search_mentor is not None:
            return JsonResponse({'filter_data_list': search_mentor}, safe=False)
        else:
            exams_with_result_p = ExamResult.objects.filter(result='P',class_id__applyend__gte=today)
            class_ids_with_result_p = exams_with_result_p.values_list('class_id', flat=True)
            filter_result = Class.objects.filter(class_id__in=class_ids_with_result_p)
            filter_result = filter_result.filter(Q(id__nickname__contains=unquote(incoding_word)))
    if theme is not None:
        sorted_theme = ','.join(sorted(theme.split(',')))
        cache_key = f'theme:{sorted_theme}'
        search_theme = cache.get(cache_key)
        if search_theme is not None:
            return JsonResponse({'filter_data_list': search_theme},safe=False)
        
        else:
            exams_with_result_p = ExamResult.objects.filter(result='P',class_id__applyend__gte=today)
            class_ids_with_result_p = exams_with_result_p.values_list('class_id', flat=True)
            filter_result = Class.objects.filter(class_id__in=class_ids_with_result_p)
            for t in theme:
                filter_result = filter_result.filter(theme__contains=t)
    if money == "fee" and option=="":
        cache_key='money_fee'
        money_fee = cache.get(cache_key)
        if money_fee is not None:
            return JsonResponse({'filter_data_list': money_fee},safe=False)
        else:
            exams_with_result_p = ExamResult.objects.filter(result='P',class_id__applyend__gte=today)
            class_ids_with_result_p = exams_with_result_p.values_list('class_id', flat=True)
            filter_result = Class.objects.filter(class_id__in=class_ids_with_result_p)
            filter_result = filter_result.exclude(money=0)
    if money == "free" and option=="":
        cache_key='money_free'
        money_free = cache.get(cache_key)
        if money_free is not None:
            return JsonResponse({'filter_data_list': money_free},safe=False)
        else:
            exams_with_result_p = ExamResult.objects.filter(result='P',class_id__applyend__gte=today)
            class_ids_with_result_p = exams_with_result_p.values_list('class_id', flat=True)
            filter_result = Class.objects.filter(class_id__in=class_ids_with_result_p)
            filter_result = filter_result.filter(money=0)
    if option == "online" and money=="":
        cache_key='type_online'
        type_online=cache.get(cache_key)
        if type_online is not None:
            return JsonResponse({'filter_data_list':type_online},safe=False)
        else:
            exams_with_result_p = ExamResult.objects.filter(result='P',class_id__applyend__gte=today)
            class_ids_with_result_p = exams_with_result_p.values_list('class_id', flat=True)
            filter_result = Class.objects.filter(class_id__in=class_ids_with_result_p)
            filter_result = filter_result.filter(type='online')
    if option == "offline" and money=="":
        cache_key='type_offline'
        type_offline = cache.get(cache_key)
        if type_offline is not None:
            return JsonResponse({'filter_data_list':type_offline})
        else:
            exams_with_result_p = ExamResult.objects.filter(result='P',class_id__applyend__gte=today)
            class_ids_with_result_p = exams_with_result_p.values_list('class_id', flat=True)
            filter_result = Class.objects.filter(class_id__in=class_ids_with_result_p)
            filter_result = filter_result.filter(type='offline')
    # 유료이면서 온라인
    if money == "fee" and option == "online":
        cache_key='fee_online'
        fee_online=cache.get(cache_key)
        if fee_online is not None:
            return JsonResponse({'filter_data_list':fee_online},safe=False)
        else:
            exams_with_result_p = ExamResult.objects.filter(result='P',class_id__applyend__gte=today)
            class_ids_with_result_p = exams_with_result_p.values_list('class_id', flat=True)
            filter_result = Class.objects.filter(class_id__in=class_ids_with_result_p)
            filter_result = filter_result.exclude(money=0).filter(type='online')
    # 무료이면서 온라인
    if money == "free" and option == "online":
        cache_key='free_online'
        free_online=cache.get(cache_key)
        if free_online is not None:
            return JsonResponse({'filter_data_list': free_online},safe=False)
        else:
            exams_with_result_p = ExamResult.objects.filter(result='P',class_id__applyend__gte=today)
            class_ids_with_result_p = exams_with_result_p.values_list('class_id', flat=True)
            filter_result = Class.objects.filter(class_id__in=class_ids_with_result_p)
            filter_result = filter_result.filter(money=0).filter(type='online')
    # 유료이면서 오프라인
    if money == "fee" and option == "offline":
        cache_key='fee_offline'
        fee_offline=cache.get(cache_key)
        if fee_offline is not None:
            return JsonResponse({'filter_data_list': fee_offline},safe=False)
        else:
            exams_with_result_p = ExamResult.objects.filter(result='P',class_id__applyend__gte=today)
            class_ids_with_result_p = exams_with_result_p.values_list('class_id', flat=True)
            filter_result = Class.objects.filter(class_id__in=class_ids_with_result_p)
            filter_result = filter_result.exclude(money=0).filter(type='offline')
    if money == "free" and option == "offline":
        cache_key='free_offline'
        free_offline=cache.get(cache_key)
        if free_offline is not None:
            return JsonResponse({'filter_data_list': free_offline},safe=False)
        else:
            exams_with_result_p = ExamResult.objects.filter(result='P',class_id__applyend__gte=today)
            class_ids_with_result_p = exams_with_result_p.values_list('class_id', flat=True)
            filter_result = Class.objects.filter(class_id__in=class_ids_with_result_p)
            filter_result = filter_result.filter(money=0).filter(type='offline')
    if filter_result.exists():
        print("필터링 결과 있음")
        filter_data_list = [extract_data_from_classmodel(item) for item in filter_result]
        cache.set(cache_key, filter_data_list, timeout=3600)
        
    else:
        cache.set(cache_key,'none', timeout=3600)
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


def read_activityclass_list(request):
    today = timezone.localdate()
    thirty_one_days_ago = today - timedelta(days=31)
    activityclass=Class.objects.filter(applyend__lt=today,applyend__gte=thirty_one_days_ago)
    activityclass_classid=[]
    for ac in activityclass:
        data={
            'class_id':ac.class_id
        }
        activityclass_classid.append(data)
    return JsonResponse({'activityClassList': activityclass_classid})  

def read_applyclass_list(request):
    today = timezone.localdate()
    print(today)
    applyokclass=Class.objects.filter(applyend__gte=today)
    print(applyokclass)
    applyokclass_list=[]
    for ac in applyokclass:
        data={
            'class_id':ac.class_id
        }
        applyokclass_list.append(data)
    print(applyokclass_list)
    return JsonResponse({'applyokclassList': applyokclass_list})  


@csrf_exempt
def check_ApplyMember(request):
    data=json.loads(request.body.decode('utf-8'))
    token=data.get('token')
    classid=data.get('classid')
    payload = jwt.decode(token, SECRET_KEY, ALGORITHM)
    user = payload['id']
    class_apply=Apply.objects.filter(id=user,class_id=classid)
    if class_apply.count()>0:
        isApplyMember = True
    else:
        isApplyMember = False
    return JsonResponse({'isApplyMember': isApplyMember})  

  
  
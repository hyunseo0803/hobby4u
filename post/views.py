from django.shortcuts import render
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.db.models import Q
from urllib.parse import unquote

import json
import jwt
import os
from .models import *
from django.core.files import File
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Class, DayClassinfo
from datetime import datetime
from datetime import timedelta

from django.core import serializers

from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')

from django.utils.dateformat import DateFormat

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
            
            
        days = data.get('days', [])
            

        class_obj = Class.objects.create(
                                            id=Member.objects.get(pk=user_id),
                                            title=title,
                                            info=info,
                                            date=date,
                                            img=imageSrc,
                                            theme=theme,
                                            people=person,
                                            money=money,
                                            type=option,
                                            intro1_file=inputimage1,
                                            intro1_content=inputinfo1,
                                            intro2_file=inputimage2,
                                            intro2_content=inputinfo2,
                                            intro3_file=inputimage3,
                                            intro3_content=inputinfo3,
                                            applyend=applyenddate,
                                            activitystart=activitystartdate,
                                            activityend=activityenddate,
                                            adress=address,
                                            file=file)
        class_obj.save()
        for day_data in days:
                print(request.FILES.get('dayImg'))
                day_sequence=day_data.get('id','')
                day_date=day_data.get('date','')
                day_title = day_data.get('title','')
                day_info = day_data.get('content','')
                day_file = request.FILES.get(f'dayImg[{day_sequence}]', None)

                
                day_class_info=DayClassinfo.objects.create(
                    class_id=class_obj,
                    sequence=day_sequence,
                    date=day_date,
                    title=day_title, 
                    info=day_info,
                    file=day_file
                    )
            
                day_class_info.save()
        return JsonResponse({'message': 'Data received and processed successfully!'})

    return JsonResponse({'error': 'Invalid request method.'}, status=400)



def read_all_data(request):
    class_all = ExamResult.objects.filter(result='P')
    
    all_data_list = []
    for all in class_all:
        all_data = {
            'class_id': all.class_id.class_id,
            'id':{
                'nickname':all.class_id.id.nickname,
                'profile':all.class_id.id.profileimg if all.class_id.id.profileimg else None,
                'updateprofile':all.class_id.id.updateprofile.url if all.class_id.id.updateprofile else None,
            },
            'title': all.class_id.title,
            'info': all.class_id.info,
            'img': all.class_id.img.url,
            'theme': all.class_id.theme,
            'people': all.class_id.people,
            'money': all.class_id.money,
            'type': all.class_id.type,
            'applyend': all.class_id.applyend,
            'activitystart': all.class_id.activitystart,
            'activityend': all.class_id.activityend,
            'goodCount': all.class_id.goodcount
        }
        all_data_list.append(all_data)
        print(all_data_list)
        
    return JsonResponse({'all_data_list':all_data_list}, safe=False)

@csrf_exempt
def read_my_data(request):
    if request.method =="POST":
        jwt_token = request.headers.get('Authorization').split(' ')[1]

        # print(request.headers.get('Authorization'))
        payload = jwt.decode(jwt_token,SECRET_KEY,ALGORITHM)
        user_id=payload['id']
        class_all = ExamResult.objects.filter(result='P')
        class_my = class_all.filter(class_id__id=user_id)
        my_data_list = []
        for all in class_my:
            all_data = {
                'class_id': all.class_id.class_id,
                'id':{
                    'nickname':all.class_id.id.nickname,
                    'profile':all.class_id.id.profileimg if all.class_id.id.profileimg else None,
                    'updateprofile':all.class_id.id.updateprofile.url if all.class_id.id.updateprofile else None,
                },
                'title': all.class_id.title,
                'info': all.class_id.info,
                'img': all.class_id.img.url,
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
            
    return JsonResponse({'all_data_list':my_data_list})

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
                    'updateprofile':judge.id.updateprofile.url if judge.id.updateprofile else None,
                },
                'title': judge.title,
                'info': judge.info,
                'img': judge.img.url,
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
        # class_all = Class.objects.all()
        judge_class = ExamResult.objects.filter(result='NP')
        judge_my=judge_class.filter(class_id__id=user_id)
        judge_np_list = []
        for judge in judge_my:
            all_data = {
                'class_id': judge.class_id.class_id,
                'id':{
                    'nickname':judge.class_id.id.nickname,
                    'profile':judge.class_id.id.profileimg if judge.class_id.id.profileimg else None,
                    'updateprofile':judge.class_id.id.updateprofile.url if judge.class_id.id.updateprofile else None,
                },
                'title': judge.class_id.title,
                'info': judge.class_id.info,
                'img': judge.class_id.img.url,
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
    
        # 현재 날짜 가져오기
    current_date = datetime.now().date()

    # 한 달 전 날짜 계산
    one_month_ago = current_date - timedelta(days=15)
    exam_result=ExamResult.objects.filter(result='P')
    
    filtered_date = exam_result.filter(date__range=[one_month_ago, current_date])
    new_date_list=[]
    for date in filtered_date:
        date_data={
            'class_id': date.class_id.class_id,
            'title': date.class_id.title,
            'info': date.class_id.info,
            'img': date.class_id.img.url,
            'theme':date.class_id.theme,
            'people': date.class_id.people,
            'money': date.class_id.money,
            'type': date.class_id.type,
            # 'applystart': date.applystart,
            'applyend': date.class_id.applyend,
            'activitystart': date.class_id.activitystart,
            'activityend': date.class_id.activityend,
            'goodCount': date.class_id.goodcount,
            'id':{
                'nickname':date.class_id.id.nickname,
                'profile':date.class_id.id.profileimg if date.class_id.id.profileimg else None,
                'updateprofile':date.class_id.id.updateprofile.url if date.class_id.id.updateprofile else None,
            }
        }
        # print(type(date.id))
        # print(type(date.class_id))
        
       
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
                    'updateprofile':cls.id.updateprofile.url if cls.id.updateprofile else None,
                },
                'date':cls.date,
                'title': cls.title,
                'info': cls.info,
                'img': cls.img.url if cls.img else None,
                'file': cls.file.url if cls.file else None,
                'theme':cls.theme,
                'people': cls.people,
                'money': cls.money,
                'type': cls.type,
                'address': cls.adress,
                'applyend': cls.applyend,
                'activitystart': cls.activitystart,
                'activityend': cls.activityend,
                'goodCount': cls.goodcount,
                'infoimg1':cls.intro1_file.url if cls.intro1_file else None,
                'infoimg2': cls.intro2_file.url if cls.intro2_file else None,
                'infoimg3': cls.intro3_file.url if cls.intro3_file else None, 
                'info1':cls.intro1_content,
                'info2':cls.intro2_content,
                'info3':cls.intro3_content
                
                
            }
            dls=DayClassinfo.objects.filter(class_id=class_id)
            day_data_list = []
            for day_ in dls:
                day_data = {
                    'day_file':day_.file.url,
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
    
    print(theme)
    # # 기본 쿼리셋
    
    exams_with_result_p = ExamResult.objects.filter(result='P')

    class_ids_with_result_p = exams_with_result_p.values_list('class_id', flat=True)

    filter_result = Class.objects.filter(class_id__in=class_ids_with_result_p)

   
        
    if incoding_word is not None and unquote(incoding_field)=="제목":
        filter_result = filter_result.filter(title__contains=unquote(incoding_word))
    if incoding_word is not None and unquote(incoding_field)=="멘토":
        filter_result = filter_result.filter(Q(id__nickname__contains=unquote(incoding_word)))
    
    # if theme is not None:
    #     filter_result = filter_result.filter(theme__contains=theme)
        
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
    for item in filter_result:
        filter_data = {
            'class_id': item.class_id,
            'id': {
                'nickname':item.id.nickname,
                'profile':item.id.profileimg if item.id.profileimg else None,
                'updateprofile':item.id.updateprofile.url if item.id.updateprofile else None,
                
            },
            'title': item.title,
            'info': item.info,
            'img': item.img.url,
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
                print("존재")
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

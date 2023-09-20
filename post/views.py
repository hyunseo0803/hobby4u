from django.shortcuts import render
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.db.models import Q

import json
import jwt
import os
from .models import Member
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
        # if data.get('option')=='offline':
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
        applystartdate=data.get('applyStartDate')
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
                                            applystart=applystartdate,
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
                day_startTime=day_data.get('startTime','')
                day_endTime=day_data.get('endTime','')
                day_title = day_data.get('title','')
                day_info = day_data.get('content','')
                day_prepare=day_data.get('prepare','')
                # day_file = day_data.get('dayImg') 
                # day_file = request.FILES.get('dayImg')
                day_file = request.FILES.get(f'dayImg[{day_sequence}]', None)

                
                day_class_info=DayClassinfo.objects.create(
                    class_id=class_obj,
                    sequence=day_sequence,
                    date=day_date,
                    startTime=day_startTime,
                    endTime=day_endTime, 
                    title=day_title, 
                    info=day_info,
                    prepare=day_prepare,
                    file=day_file
                    )
            
                day_class_info.save()
        return JsonResponse({'message': 'Data received and processed successfully!'})

    return JsonResponse({'error': 'Invalid request method.'}, status=400)



def read_all_data(request):
        class_all= Class.objects.values()   #쿼리셋 Django.db.models.query.QuerySet
        return JsonResponse(list(class_all) ,safe=False)  #리스트
    
    
def read_new_data(request):
    
        # 현재 날짜 가져오기
    current_date = datetime.now().date()

    # 한 달 전 날짜 계산
    one_month_ago = current_date - timedelta(days=30)
    
    filtered_date = Class.objects.filter(date__range=[one_month_ago, current_date])
    new_date_list=[]
    for date in filtered_date:
        date_data={
            'class_id': date.class_id,
                'title': date.title,
                'info': date.info,
                'img': date.img.url,
                'theme':date.theme,
                'people': date.people,
                'money': date.money,
                'type': date.type,
                'applystart': date.applystart,
                'applyend': date.applyend,
                'activitystart': date.activitystart,
                'activityend': date.activityend,
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
                'title': cls.title,
                'info': cls.info,
                'img': cls.img.url,
                'theme':cls.theme,
                'people': cls.people,
                'money': cls.money,
                'type': cls.type,
                'applystart': cls.applystart,
                'applyend': cls.applyend,
                'activitystart': cls.activitystart,
                'activityend': cls.activityend,
                
                
            }
            dls=DayClassinfo.objects.filter(class_id=class_id)
            day_data_list = []
            for day_ in dls:
                day_data = {
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
    apply_ok_str=request.GET.get('apply_ok')
    today = request.GET.get('today')

    if apply_ok_str == 'true':
        apply_ok = True
    else:
        apply_ok = False
    # 기본 쿼리셋
    filter_result = Class.objects.all()
    
    if money == "fee":
        filter_result = filter_result.exclude(money=0)
    if money == "free":
        filter_result = filter_result.filter(money=0)
        
    if option == "online":
        filter_result = filter_result.filter(type='online')
    if option == "offline":
        filter_result = filter_result.filter(type='offline')
    
    if apply_ok:
        filter_result=filter_result.filter(applyend__gt=today)
    
    # 유료이면서 온라인
    if money == "fee" and option == "online":
        filter_result = filter_result.exclude(money=0).filter(type='online')

    # 무료이면서 온라인
    if money == "free" and option == "online":
        filter_result = filter_result.filter(money=0).filter(type='online')

    # 유료이면서 오프라인
    if money == "fee" and option == "offline":
        filter_result = filter_result.exclude(money=0).filter(type='offline')

    #무료이면서 신청가능
    if money=="free" and apply_ok:
        filter_result = filter_result.filter(money=0).filter(applyend__gt=today)
    #유료이면서 신청가능
    if money=="fee" and apply_ok:
        filter_result = filter_result.exclude(money=0).filter(applyend__gt=today)
    #오프라인이면서 신청가능
    if option=="offline" and apply_ok:
        filter_result = filter_result.filter(type="offline").filter(applyend__gt=today)
    #온라인이면서 신청가능
    if option=="online" and apply_ok:
        filter_result = filter_result.filter(type="online").filter(applyend__gt=today)
    
    # 무료이면서 오프라인
    if money == "free" and option == "offline":
        filter_result = filter_result.filter(money=0).filter(type='offline')
        
    #무료이면서 오프라인 이면서 신청가능
    if money == "free" and option == "offline" and apply_ok:
        filter_result = filter_result.filter(money=0).filter(type='offline').filter(applyend__gt=today)
    #유료이면서 오프라인 이면서 신청가능 
    if money == "fee" and option == "offline" and apply_ok:
        filter_result = filter_result.exclude(money=0).filter(type='offline').filter(applyend__gt=today)
    #무료이면서 온라인 이면서 신청가능
    if money == "free" and option == "online" and apply_ok:
        filter_result = filter_result.filter(money=0).filter(type='online').filter(applyend__gt=today)
    #우료이면서 오프라인 이면서 신청가능
    if money == "fee" and option == "online" and apply_ok:
        filter_result = filter_result.exclude(money=0).filter(type='online').filter(applyend__gt=today)
    
    filter_data_list = []
    for item in filter_result:
        filter_data = {
            'class_id': item.class_id,
            'title': item.title,
            'info': item.info,
            'img': item.img.url,
            'theme': item.theme,
            'people': item.people,
            'money': item.money,
            'type': item.type,
            'applystart': item.applystart,
            'applyend': item.applyend,
            'activitystart': item.activitystart,
            'activityend': item.activityend,
        }
        filter_data_list.append(filter_data)
    
    return JsonResponse({'filter_data_list': filter_data_list}, safe=False)

# 
from django.shortcuts import render
import json
import jwt
import os
from .models import Member
from django.core.files import File
# Create your views here.
# views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Class, DayClassinfo
from datetime import datetime

from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')

from django.utils.dateformat import DateFormat
# import random

# number = set()
# while len(number)<5: 
#     number.add(random.randint(1,9)) # 추가할 숫자가 중복이면 추가가 되질 않습니다.



@csrf_exempt
def submit_data(request):
    
    if request.method == 'POST':
        json_data = request.POST.get('json')  # JSON 데이터 받기
        data = json.loads(json_data)
        if data.get('option')=='offline':
            token=data.get('token')
            payload = jwt.decode(token,SECRET_KEY,ALGORITHM)
            user_id=payload['id']
            
            date= DateFormat(datetime.now()).format('Ymd')
            title=data.get('title')
            person = data.get('person')
            info = data.get('info')
            option = data.get('option')
            imageSrc=request.FILES.get("imageSrc")
            address = data.get('address')
            money = data.get('money')
            theme = data.get('theme')
            applystartdate=data.get('toStringApplyStartDate')
            applyenddate=data.get('toStringApplyEndDate')
            activitystartdate=data.get('toStringActivityStartDate')
            activityenddate=data.get('toStringActivityEndDate')
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
        if data.get('option')=='online':
            None

    

    

        return JsonResponse({'message': 'Data received and processed successfully!'})

    return JsonResponse({'error': 'Invalid request method.'}, status=400)

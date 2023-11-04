from django.shortcuts import render
from .models import *
from django.core.mail import EmailMessage
from django.core import signing
import bcrypt
from rest_framework.views import APIView
from rest_framework.response import Response

from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
import jwt
from rest_framework.decorators import api_view
from jwt.exceptions import ExpiredSignatureError

from django.utils import timezone
from datetime import datetime, timedelta
from django.db.models import F
import os
from dotenv import load_dotenv

load_dotenv()

DEFAULT_EMAIL = os.getenv('DEFAULT_EMAIL')
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')
SUPER_ADMIN_ID=os.getenv('SUPER_ADMIN_ID')
SUPER_ADMIN_PW=os.getenv('SUPER_ADMIN_PW')

@csrf_exempt
def send_identification_code(request):
    if request.method=="POST":
        data=json.loads(request.body.decode('utf-8'))
        email = data.get('inputEmail')
        verification_code = secrets.token_hex(5)
        
        subject = '관리자 등록 인증 이메일'
        message = f'인증 코드: {verification_code}'
        from_email = DEFAULT_EMAIL
        to = [email]					
        EmailMessage(subject=subject, body=message, to=to, from_email=from_email).send()
        print('메일 보냄')
        
        
        data = {'email': email, 'verification_code': verification_code}
        jwt_email_code = jwt.encode(data, SECRET_KEY, ALGORITHM)

    return JsonResponse({'message':jwt_email_code})

@csrf_exempt
def check_identification_code(request):
    if request.method=="POST":
        data=json.loads(request.body.decode('utf-8'))
        inputcode = data.get('inputcode')
        jwt_email_code = data.get('true_email_code')
        email_code = jwt.decode(jwt_email_code,SECRET_KEY,ALGORITHM)

        if email_code['verification_code']:
            if inputcode==email_code['verification_code'] :
                message="success"
                return JsonResponse({'result':message})
            else: 
                message="failure"
                return JsonResponse({'result':message})

    return JsonResponse({'message':"post 메소드"})

@csrf_exempt
def approve_nickname_check(request):
    if request.method =="POST":
        data=json.loads(request.body.decode("utf-8"))
        inputNickname=data.get('inputNickname')
        admin_nickname=Admin.objects.filter(nickname__in=[inputNickname])
        if admin_nickname.count()==0:
            return JsonResponse({'message':'사용가능한 닉네임 입니다.'})
        else:
            return JsonResponse({'message':'이미 존재하는 닉네임 입니다.'})
        
    return JsonResponse({'message':'확인중'})
        




@csrf_exempt
def request_admin_approve(request):
    if request.method == 'POST':
        data=json.loads(request.body.decode('utf-8'))
        nickname=data.get('inputNickname')
        phone=data.get('inputPhone')
        plainPw=data.get('inputPw')
        encodePw=bcrypt.hashpw(plainPw.encode('utf-8'),bcrypt.gensalt())
        decodePw=encodePw.decode('utf-8')
    
        email=data.get('inputEmail')

        admin=Admin(nickname=nickname,email=email,pw=decodePw,contact=phone)
        admin.save()
    return JsonResponse({'message': 'success'})

@csrf_exempt
def approve_admin(request):
    if request.method =="POST":
        data=json.loads(request.body.decode('utf-8'))
        admin_id=data.get('admin_id')
        admin_approve=Admin.objects.get(admin_id=admin_id)
        admin_approve.is_approve=True
    return JsonResponse({'message':'admin_approve_success'})
    



@csrf_exempt
def login_admin(request):
    if request.method == 'POST':
        data=json.loads(request.body.decode('utf-8'))
        nickname=data.get('inputNickname')
        inputpw=data.get('inputPw')
        if nickname==SUPER_ADMIN_ID and inputpw==SUPER_ADMIN_PW:
            return JsonResponse({'message':"main 관리자"})

        else:
            
            try: 
                adminRead=Admin.objects.get(nickname=nickname)
                isApprove=adminRead.is_approve
                if isApprove==1:
                    adminpw = adminRead.pw.encode('utf-8')
                    isVailPw=bcrypt.checkpw(inputpw.encode('utf-8'), adminpw)
                    if isVailPw:
                        expires_at = datetime.utcnow() + timedelta(hours=2)
                        payload = {'id': adminRead.admin_id, 'exp': expires_at}
                        jwt_token = jwt.encode(payload, SECRET_KEY, ALGORITHM)
                        return JsonResponse({"jwt_token":jwt_token})
                    else :
                        return JsonResponse({'message':"비밀번호가 일치하지 않습니다."})
                else:
                    return JsonResponse({'message':"승인이 완료되지 않은 관리자 입니다."})
            except:
                return JsonResponse({'message':'존재하지 않는 관리자 계정입니다.'})
    return JsonResponse({'message':"로그인"})

        
@api_view(['POST'])       
def get_admin_data(request):
    if request.method == "POST":
        try:
            jwt_token = request.headers.get('Authorization').split(' ')[1]
            
            payload = jwt.decode(jwt_token,SECRET_KEY,ALGORITHM)
            admin_id=payload['id']
            admin=Admin.objects.get(admin_id=admin_id)

            response_data = {
                        'nickname': admin.nickname,
                        'email':admin.email,
                        
                    }
            print(response_data)
        except ExpiredSignatureError:
        # 만료된 토큰에 대한 예외 처리
            return Response({'error': 'Token has expired'}, status=401)
    return Response(response_data)
   

def read_not_admin(request):
    not_admin=Admin.objects.exclude(is_approve=1)
    not_admin_list=[]
    for admin in not_admin:
        data={'nickname':admin.nickname,
            'email':admin.email,
            'contact':admin.contact
            
            }
        not_admin_list.append(data)
    return JsonResponse({'not_admin_list':not_admin_list})
    
            
def get_judge_count(request):
    class_all = Class.objects.all()
    notFinshCnt=class_all.exclude(class_id__in=ExamResult.objects.values('class_id')).count()
    finishCnt=class_all.filter(class_id__in=ExamResult.objects.values('class_id')).count()
    print(notFinshCnt)
    print(finishCnt)
    return JsonResponse({'finishCnt':finishCnt,'notFinshCnt':notFinshCnt})


def get_judge_deadline_count(request):
    class_all = Class.objects.all()
    notFinish=class_all.exclude(class_id__in=ExamResult.objects.values('class_id'))
    today = timezone.now().date()

    four_days_ago = today - timedelta(days=4)
    notFinish_deadlineCnt = notFinish.filter(date__lt=four_days_ago).count()

    notFinish_deadline = notFinish.filter(date__lt=four_days_ago)
    notFinish_deadline_list=[]
    for notFinish in notFinish_deadline:
        data={
            'class_id':notFinish.class_id
        }
        
        notFinish_deadline_list.append(data)

    return JsonResponse({'deadlineCnt':notFinish_deadlineCnt,'deadline':notFinish_deadline_list})
    
    
    
     
def read_judge_class(request):
    class_all = Class.objects.all()
    judge_class = class_all.exclude(class_id__in=ExamResult.objects.values('class_id'))
    judge_data_list = []
    for judge in judge_class:
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
def create_board_content(request):
    if request.method == 'POST':
        data=json.loads(request.body.decode('utf-8'))
        boardContent=data.get('boardContent')
        boardWriter=data.get('writer')
        today=timezone.now().date()
        upload_content=AdminMessage(writer=Admin.objects.get(nickname=boardWriter),message=boardContent,date=today)
        upload_content.save()
    return JsonResponse({'status':"ok"})

@csrf_exempt
def delete_board_content(request):
    if request.method == 'POST':
        data=json.loads(request.body.decode('utf-8'))
        boardNum=data.get('index')
        print(boardNum)
        board=AdminMessage(num=boardNum)
        board.delete()
        
    return JsonResponse({'status':"ok"})


def read_board_content(request):
    boardList=[]
    board=AdminMessage.objects.all()
    for b in board:
        data={
            'num':b.num,
            'writer':b.writer.nickname,
            'content':b.message,
            'date':b.date
            
        }
        boardList.append(data)
    return JsonResponse({'boardList':boardList})
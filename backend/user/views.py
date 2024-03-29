from django.shortcuts import render,redirect
from rest_framework import generics ,status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from .models import *
from .serializers import MemberSerializer
from django.views.generic import View
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import jwt
import os
import requests
import hashlib
import random
import string
import urllib
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv
from django.shortcuts import get_object_or_404

from jwt.exceptions import ExpiredSignatureError
from rest_framework.exceptions import APIException
import firebase_admin
from firebase_admin import credentials, storage
from django.http import JsonResponse





# cred = credentials.Certificate('C:\\Users\\hyunseo\\Hobby4U\\hobby4u\\firebase_sdk.json')
# firebase_admin.initialize_app(cred, {'storageBucket': 'hivehobby.appspot.com'})
import selenium
from selenium import webdriver
from selenium.webdriver.common.by import By
from time import sleep




load_dotenv()

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
ALGORITHM = os.environ.get('DJANGO_JWT_ALGORITHM')
KAKAO_APP_KEY=os.environ.get('KAKAO_APP_KEY')
KAKAO_APP_SECRET=os.environ.get('KAKAO_APP_SECRET')
KAKAO_LOCALHOST_REDIRECT_URL=os.environ.get('KAKAO_LOCALHOST_REDIRECT_URL')
KAKAO_NETLIFY_REDIRECT_URL=os.environ.get('KAKAO_NETLIFY_REDIRECT_URL')

# print("===================================")
# print(KAKAO_APP_KEY)
# print(KAKAO_APP_SECRET)



def randm_num():
    num = "0123456789"
 
    result=""
    for i in range(4):
        result+=random.choice(num)
        
    return result
    

def generate_random_hash(file_name):
 
    # 임의의 솔트(salt)를 생성
    file_name_without_extension, file_extension = file_name.split('.')

    # 파일 이름을 해시화
    hashed_file_name = hashlib.sha256(file_name_without_extension.encode()).hexdigest()

    # 해싱된 파일 이름과 확장자 결합
    hashed = f"{hashed_file_name}{randm_num()}.{file_extension}"
    return hashed

def upload_to_firebase(file,folder_name):
    # Firebase 스토리지에 파일 업로드
    bucket = storage.bucket()
    filename=generate_random_hash(file.name)
    
    blob = bucket.blob(folder_name+'/'+filename)
    blob.upload_from_file(file)
    
    return filename


class MemberList(generics.ListCreateAPIView):
    queryset=Member.objects.all()
    serializer_class=MemberSerializer
    
class MemberDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset=Member.objects.all()
    serializer_class=MemberSerializer
    
        
@api_view(['POST'])
def KakaoCallbackView(request):
    if request.method == "POST":
        body =  json.loads(request.body.decode('utf-8'))
        code= body["code"]
        app_key =os.environ.get('KAKAO_APP_KEY')
        app_secret = os.environ.get('KAKAO_APP_SECRET')
        redirect_uri = KAKAO_LOCALHOST_REDIRECT_URL

        token_api = 'https://kauth.kakao.com/oauth/token'
        headers = {'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'}

        data = {
            'grant_type': 'authorization_code',
            'client_id': app_key,
            'client_secret': app_secret,
            'redirect_uri': redirect_uri,
            'code': code,
        }
        response = requests.post(token_api, headers=headers, data=data) 

        if response.status_code == 200:
            tokens = json.loads(response.text)
            access_token = tokens.get('access_token')

            profile_api = 'https://kapi.kakao.com/v2/user/me'
            headers = {'Authorization': f'Bearer {access_token}'}
            response = requests.post(profile_api, headers=headers)

            if response.status_code == 200:
                profile = json.loads(response.text)
                kakao_account = profile.get('kakao_account')
                id = profile.get('id')
                profileimg = profile.get('properties', {}).get('profile_image')
                email = kakao_account.get('email')
                nickname = kakao_account.get('profile').get('nickname')

            try:
                    # 이미 회원 가입되어 있는 사용자인지 확인
                member = Member.objects.get(id=id)
                print("이미 가입된 사용자")
                
                expires_at = datetime.utcnow() + timedelta(hours=2)
                payload = {'id': member.id, 'exp': expires_at}

                jwt_token = jwt.encode(payload, SECRET_KEY, ALGORITHM)
                
                response_data = {
                        'token': jwt_token,
                        'access_token':access_token
                    }
                return Response(response_data)
                    
            except Member.DoesNotExist:
                    # 회원 가입되어 있지 않으면 새로 추가
                member = Member.objects.create(
                    id=id,
                    email=email,
                    nickname=nickname,
                    info="안녕하세요. 많은 관심과 사랑 부탁드려요 !",
                    profileimg=profileimg,
                    provider="kakao",
                    joindate=datetime.today().date()
            
                    )
                member.save()
                
                expires_at = datetime.utcnow() + timedelta(hours=2)
                payload = {'id': member.id, 'exp': expires_at}

                jwt_token = jwt.encode(payload, SECRET_KEY, ALGORITHM)
                
                response_data = {
                    'id': member.id,
                    'nickname': member.nickname,
                    'access_token': access_token,
                    'token': jwt_token,
                    'exist': False,
                }
                return Response(response_data)

        else:
                return Response('Failed to get user profile', status=response.status_code)
    else:
            return Response('Failed to get access token', status=response.status_code)
       
# @api_view(['POST']) 
@csrf_exempt      
def get_user_data(request):
    try:
        if request.method == "POST":
            data=json.loads(request.body.decode("utf-8"))
            jwt_token = data.get('token')     
            payload = jwt.decode(jwt_token,SECRET_KEY,ALGORITHM)
            user_id=payload['id']
            member=Member.objects.get(id=user_id)

            response_data = {
                        'id': member.id,
                        'nickname': member.nickname,
                        'info': member.info,
                        'email':member.email,
                        'profileImg':member.profileimg if member.profileimg else None,
                        'updateprofile':member.updateprofile if member.updateprofile else None,
                        'receive_cash':member.receive_cash,
                        'get_cash':member.get_cash
                        
                    }
        return JsonResponse({'response_data':response_data})
    except ExpiredSignatureError:
        # 만료된 토큰에 대한 예외 처리
        return Response({'error': 'Token has expired'}, status=401)
    except Exception as e:
        # 다른 예외가 발생한 경우 클라이언트로 에러 응답을 보냅니다.
        return Response({'error': str(e)}, status=500)
    
    
@api_view(['POST'])
def save_user_info(request):
    if request.method=="POST":
        jwt_token = request.headers.get('Authorization').split(' ')[1]
        payload = jwt.decode(jwt_token,SECRET_KEY,ALGORITHM)
        user_id=payload['id']
        json_data = json.loads(request.POST.get('json'))
        nickname = json_data.get('nickname')
        info = json_data.get('info')
        updateimg=request.FILES.get('updatedimg')
        
        
        member=Member.objects.get(id=user_id) 
    
        if updateimg is not None:
            member_update_img=upload_to_firebase(updateimg,"userImg")
            member.updateprofile=member_update_img
            
        member.nickname=nickname
        member.info=info
        member.save()
        
    return Response("success")

@api_view(['POST'])
def save_user_achive(request):
    if request.method=="POST":
        jwt_token = request.headers.get('Authorization').split(' ')[1]
        payload = jwt.decode(jwt_token,SECRET_KEY,ALGORITHM)
        user_id=payload['id']
        json_data = json.loads(request.POST.get('json'))
        link=json_data.get('link')
        linkName = json_data.get('linkName')
        fileName=json_data.get('fileName')
        achive_file_list =[]
        for index in range(len(request.FILES)):
            file_key = f'file{index}'
            if file_key in request.FILES:
                achive_file = request.FILES[file_key]
            achive_file_list.append(achive_file)
            
        if len(link)>0:
            for l, ln in zip(link, linkName):
                achive=Performance(id=Member.objects.get(id=user_id) )

                achive.link=l
                achive.link_title=ln
                achive.save()
                
        if len(achive_file_list)>0:
            for f, fn in zip(achive_file_list, fileName):
                achive=Performance(id=Member.objects.get(id=user_id) )
                achive_f = upload_to_firebase(f,"userAchiveFile")
                achive.file=achive_f
                achive.file_title=fn
                achive.save()
                
    return Response("success")

@api_view(['POST'])
def delete_user_achive(request):
    if request.method=="POST":
        jwt_token = request.headers.get('Authorization').split(' ')[1]
        payload = jwt.decode(jwt_token,SECRET_KEY,ALGORITHM)
        user_id=payload['id']
        json_data = json.loads(request.POST.get('json'))
        
        type = json_data.get('type')
        
        data = json_data.get('data')
        
        if type=='link':
            item = Performance.objects.get(link=data)
            item.delete()
            
        if type=='file':
            url_without_params = data.split('?')[0]
            decoded_url = urllib.parse.unquote(url_without_params)
            pdf_path = decoded_url.split("userAchiveFile/")[1]
            item = Performance.objects.get(file=pdf_path)
            item.delete()
        
    return Response("success")

# @api_view(['POST'])   
@csrf_exempt    
def get_user_achive(request):
    data=json.loads(request.body.decode("utf-8"))
    token=data.get('token')
    mentor=data.get('mentor')
    
    print("멘토 아이디:",mentor)
    
    user_id = None
    
    if token:
        payload = jwt.decode(token, SECRET_KEY, ALGORITHM)
        user_id = payload['id']
    elif mentor:
        user_id=mentor
        
    print("작성자 id:",user_id)
    
    achive = Performance.objects.filter(id=user_id)
    achive_list = []
    for achive_data in achive:
        data = {
            'achive_file': achive_data.file if achive_data.file else None,
            'achive_filename': achive_data.file_title,
            'achive_link': achive_data.link,
            'achive_linkname': achive_data.link_title
        }
        achive_list.append(data)
    return JsonResponse({'achive_list':achive_list})


def get_cashback_list(request):
    jwt_token = request.headers.get('Authorization').split(' ')[1]
    payload = jwt.decode(jwt_token,SECRET_KEY,ALGORITHM)
    user_id=payload['id']
    
    cash=Cashback.objects.filter(id=Member.objects.get(id=user_id))
    if cash.count()>0:
        cashlist=[]
        for c in cash:
            data={
                'num':c.num,
                'id':c.id.id,
                'class_id':c.class_id.title,
                'class_num':c.class_id.class_id,
                'money':c.class_id.money,
                'cashback':c.cash,
                'status':c.status
            }
            cashlist.append(data)
        return JsonResponse({'cashlist':cashlist})
    else:
        return None

@api_view(['POST'])   
def get_cash_button(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        cash_back_list = data.get('cashBackList',[])
        if cash_back_list:
            for cash_back_item in cash_back_list:
                cash_list=Cashback.objects.filter(id=Member.objects.get(id=cash_back_item['id']))
                if cash_list.count()>0:
                    cl_mem=Member.objects.get(id=cash_back_item['id'])
                    cl_mem.get_cash+=cl_mem.receive_cash
                    cl_mem.receive_cash=0
                    cl_mem.save()
                    for cl in cash_list:
                        cl.status="지급완료"
                        cl.save()
                    else: return None
        else:
            return None
    return JsonResponse({'message':'ok'})        
        
    

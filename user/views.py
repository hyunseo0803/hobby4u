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
import jwt
import os
import requests

import json
from datetime import datetime, timedelta
from dotenv import load_dotenv
from django.shortcuts import get_object_or_404

from jwt.exceptions import ExpiredSignatureError
from rest_framework.exceptions import APIException


load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')
KAKAO_APP_KEY=os.getenv('KAKAO_APP_KEY')
KAKAO_APP_SECRET=os.getenv('KAKAO_APP_SECRET')
KAKAO_REDIRECT_URL=os.getenv('KAKAO_REDIRECT_URL')


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
            app_key =KAKAO_APP_KEY
            app_secret = KAKAO_APP_SECRET
            redirect_uri = KAKAO_REDIRECT_URL

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
                        'exist': False
                    }
                    return Response(response_data)

            else:
                return Response('Failed to get user profile', status=response.status_code)
        else:
            return Response('Failed to get access token', status=response.status_code)
        
        
@api_view(['POST'])       
def get_user_data(request):
    try:
        if request.method == "POST":
            jwt_token = request.headers.get('Authorization').split(' ')[1]
            
            payload = jwt.decode(jwt_token,SECRET_KEY,ALGORITHM)
            user_id=payload['id']
            member=Member.objects.get(id=user_id)

            response_data = {
                        'id': member.id,
                        'nickname': member.nickname,
                        'info': member.info,
                        'email':member.email,
                        'profileImg':member.profileimg if member.profileimg else None,
                        'updateprofile':member.updateprofile.url if member.updateprofile else None
                        
                    }
        return Response(response_data)
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
        email = json_data.get('email')
        link=json_data.get('link')
        linkName = json_data.get('linkName')
        # file=request.FILES.get('file')
        fileName=json_data.get('fileName')
        achive_file_list =[]
        for index in range(len(request.FILES)):
            file_key = f'file{index}'
            if file_key in request.FILES:
                achive_file = request.FILES[file_key]
            achive_file_list.append(achive_file)
            
        updateimg=request.FILES.get('updatedimg')
        
        member=Member.objects.get(id=user_id) 
        
        if len(link)>0:
            print("링크넣엇음 링크을")
            for l, ln in zip(link, linkName):
                achive=Performance(id=Member.objects.get(id=user_id) )

                achive.link=l
                achive.link_title=ln
                achive.save()
                
        if len(achive_file_list)>0:
            print("파일 넣어씅ㅁ 파일")
            for f, fn in zip(achive_file_list, fileName):
                achive=Performance(id=Member.objects.get(id=user_id) )
                achive.file=f
                achive.file_title=fn
                achive.save()
                
        if updateimg is not None:
            member.updateprofile=updateimg
            
        member.nickname=nickname
        member.email=email
        member.info=info
        member.save()
        
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
        
        print(type)
        print(data)
        if type=='link':
            item = Performance.objects.get(link=data)
            item.delete()
            
        if type=='file':
            item = Performance.objects.get(file_title=data)
            item.delete()
        
    return Response("success")

@api_view(['POST'])       
def get_user_achive(request):
    if request.method =='POST':
        jwt_token = request.headers.get('Authorization').split(' ')[1]
        # try:
        payload = jwt.decode(jwt_token, SECRET_KEY, ALGORITHM)
        user_id = payload['id']
        achive = Performance.objects.filter(id=user_id)
        achive_list = []
        for achive_data in achive:
            data = {
                'achive_file': achive_data.file.url if achive_data.file else None,
                'achive_filename': achive_data.file_title,
                'achive_link': achive_data.link,
                'achive_linkname': achive_data.link_title
            }
            achive_list.append(data)
        return Response(achive_list)
    #     except jwt.ExpiredSignatureError:
    #         return Response({'error': 'Expired token'}, status=status.HTTP_401_UNAUTHORIZED)
    #     except jwt.InvalidTokenError:
    #         return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
    #     except Exception as e:
    #         return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    # else:
    #     return Response({'error': 'Invalid request method'}, status=status.HTTP_400_BAD_REQUEST)


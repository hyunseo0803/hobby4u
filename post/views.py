from django.shortcuts import render,redirect
from rest_framework import generics 
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required
from .models import Member
from .serializers import MemberSerializer
from django.views.generic import View
from django.http import HttpResponse, JsonResponse
import jwt
import os
import requests
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv


load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')


class MemberList(generics.ListCreateAPIView):
    queryset=Member.objects.all()
    serializer_class=MemberSerializer
    
class MemberDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset=Member.objects.all()
    serializer_class=MemberSerializer
    
    
class KakaoSignUpView(View):
    def get(self,request):
        # load_dotenv()
        app_key ='625fbab96c202cda5ddf24a9c200657d'
        redirect_uri = 'http://localhost:8000/kakao/callback'
        response = HttpResponse("Hello, world!")
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        return redirect(
            f'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id={app_key}&redirect_uri={redirect_uri}'
        )
        
class KakaoCallbackView(View):
    def get(self, request):
        load_dotenv()
        code = request.GET.get('code')
        app_key ='625fbab96c202cda5ddf24a9c200657d'
        app_secret = 'Xw8bsmCEkjsNrrvDptsw9PxDfZPX6Uti'
        redirect_uri = 'http://localhost:8000/kakao/callback'

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
        # print(response)

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
                profileimg=profile.get('profile_image_url')
                email = kakao_account.get('email')
                nickname = kakao_account.get('profile').get('nickname')

                try:
                        # 이미 회원 가입되어 있는 사용자인지 확인
                    member = Member.objects.get(id=id)
                        # request.session['user_id'] = member.id
                    print(member.id)
                    
                    expires_at = datetime.utcnow() + timedelta(hours=2)
                    payload = {'id': member.id, 'exp': expires_at}

                    jwt_token = jwt.encode(payload, SECRET_KEY, ALGORITHM)
                    
                    # return redirect('http://localhost:3000/')
                        
                    return JsonResponse({'id':member.id, 'nickname':member.nickname, 'token':jwt_token, 'exist':True})
                        # return JsonResponse({'token':jwt_token})
                except Member.DoesNotExist:
                        # 회원 가입되어 있지 않으면 새로 추가
                    member = Member.objects.create(
                        id=id,
                        email=email,
                        nickname=nickname,
                        profileimg=profileimg
                
                        )
                    member.save()
                        # access_token을 세션에 저장한다
                    request.session['access_token'] = access_token
                        # 사용자 ID를 세션에 저장한다
                    request.session['user_id'] = member.id
                    
                    expires_at = datetime.utcnow() + timedelta(hours=2)
                    payload = {'id': member.id, 'exp': expires_at}

                    jwt_token = jwt.encode(payload, SECRET_KEY, ALGORITHM)
                    
                    return JsonResponse({'id':member.id, 'nickname':member.nickname, 'token':jwt_token, 'exist':True})

                    # 로그인이 완료되었으므로, 다시 React App으로 리다이렉트
                    # return redirect('http://localhost:3000/')
            else:
                return HttpResponse('Failed to get user profile', status=response.status_code)
        else:
            return HttpResponse('Failed to get access token', status=response.status_code)
        
        
        
def get_user_data(request):
    
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        payload = jwt.decode(token,SECRET_KEY,ALGORITHM)
        user_id=payload['id']
        member=Member.objects.get(id=user_id)
        
        return JsonResponse({'id':member.id,'name':member.nickname,'email':member.email})
    except jwt.exceptions.InvalidSignatureError:
        return JsonResponse({'error': 'Invalid token'})
    except Member.DoesNotExist:
        return JsonResponse({'error': 'Member does not exist'})
    

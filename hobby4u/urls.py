"""
URL configuration for hobby4u project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.views.generic import TemplateView
from post.views import KakaoSignUpView
from post.views import KakaoCallbackView
# from post.views import get_user_data

urlpatterns = [
    path('admin/', admin.site.urls),
    path('/',include('post.urls')),
    path('',TemplateView.as_view(template_name='index.html')),
    path('kakao/callback/', KakaoCallbackView),  # 수정된 부분
    path('kakao/login/', KakaoSignUpView),  # 수정된 부분
    # path('get_user_data/', get_user_data)
    # path('user/',UserView.as_view()),

]

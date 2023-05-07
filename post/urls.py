from django.urls import path
from . import views
from .views import KakaoSignUpView
from .views import KakaoCallbackView
# from .views import check_login_status

urlpatterns = [
    # path('',views.MemberList.as_view()),
    # path('<int:pk>/',views.MemberDetail.as_view()),
    path('kakao/callback/',KakaoCallbackView.as_view()),
    path('kakao/login/',KakaoSignUpView.as_view()),
    path('get_user_data/',views.get_user_data)
    
    # path('/api/check_login_status/',check_login_status),
]

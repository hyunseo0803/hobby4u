from django.urls import path
from . import views
# from .views import KakaoCallbackView
# from .views import get_user_data
# from .views import check_login_status

urlpatterns = [
    path('',views.MemberList.as_view()),
    path('<int:pk>/',views.MemberDetail.as_view()),
    path('kakao/callback/',views.KakaoCallbackView),
    path('kakao/login/',views.KakaoSignUpView),
    path('get_user_data/',views.get_user_data)
    
    # path('/api/check_login_status/',check_login_status),
]

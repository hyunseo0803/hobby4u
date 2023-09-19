from django.urls import path
from . import views
# from .views import KakaoCallbackView
# from .views import get_user_data
# from .views import check_login_status

urlpatterns = [
    path('submit_data/',views.submit_data),
    path('read_all_data/',views.read_all_data),
    path('read_some_data/',views.read_some_data),
    # path('',views.MemberList.as_view()),
    # path('<int:pk>/',views.MemberDetail.as_view()),
    # path('kakao/callback/',views.KakaoCallbackView),
    # path('kakao/login/',views.KakaoSignUpView),
    # path('get_user_data/',views.get_user_data)
    
    # path('/api/check_login_status/',check_login_status),
]

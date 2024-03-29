from django.urls import path
from . import views
# from .views import KakaoCallbackView
# from .views import get_user_data
# from .views import check_login_status

urlpatterns = [
    # path('',views.MemberList.as_view()),
    # path('<int:pk>/',views.MemberDetail.as_view()),
    path('kakao/callback/',views.KakaoCallbackView),
    # path('login/',views.KakaoSignUpView),
    path('get_user_data/',views.get_user_data),
    path('save_user_info/',views.save_user_info),
    path('save_user_achive/',views.save_user_achive),
    path('get_user_achive/',views.get_user_achive),
    path('delete_user_achive/',views.delete_user_achive),
    path('get_cashback_list/',views.get_cashback_list),
    path('get_cash_button/',views.get_cash_button),
    # path('kakaoLogout/',views.kakao_logout)
    
    # path('/api/check_login_status/',check_login_status),
]

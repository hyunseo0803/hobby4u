from django.urls import path
from . import views
# from .views import KakaoCallbackView
# from .views import get_user_data
# from .views import check_login_status
 
urlpatterns = [
    path('submit_data/',views.submit_data),
    path('read_all_data/',views.read_all_data),
    path('read_my_data/',views.read_my_data),
    path('read_judge_my/',views.read_judge_my),
    path('read_judge_np/',views.read_judge_np),
    path('read_new_data/',views.read_new_data),
    path('read_some_data/',views.read_some_data),
    path('read_filter_data/',views.read_filter_data),
    path('create_goodCount_data/',views.create_goodCount_data),
    path('read_goodCount_data/',views.read_goodCount_data),

  

    # path('',views.MemberList.as_view()),
    # path('<int:pk>/',views.MemberDetail.as_view()),
    # path('kakao/callback/',views.KakaoCallbackView),
    # path('kakao/login/',views.KakaoSignUpView),
    # path('get_user_data/',views.get_user_data)
    
    # path('/api/check_login_status/',check_login_status),
]
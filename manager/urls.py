from django.urls import path
from . import views

 
urlpatterns = [
    path('send_identification_code/',views.send_identification_code),
    path('check_identification_code/',views.check_identification_code),
    path('request_admin_approve/',views.request_admin_approve),
    path('approve_nickname_check/',views.approve_nickname_check),
    path('approve_admin/',views.approve_admin),
    path('login_admin/',views.login_admin),
    path('get_admin_data/',views.get_admin_data),
    path('read_not_admin/',views.read_not_admin),
    path('get_judge_count/',views.get_judge_count),
    path('get_judge_deadline_count/',views.get_judge_deadline_count),
    path('read_judge_class/',views.read_judge_class),
   path('create_board_content/',views.create_board_content),
   path('read_board_content/',views.read_board_content),
   path('delete_board_content/',views.delete_board_content)
]

# polls/urls.py

from django.urls import path
from . import views  # ← 꼭 이렇게 상대 경로로 import


   
   
    
urlpatterns = [
     path('index/', views.index, name='index'),
    path('chat/', views.chat, name='chat'),
    path('get_memory_records/', views.get_memory_records, name='get_memory_records'),
    path('fourpanel/', views.fourpanel, name='fourpanel'),
    path('memorygame/', views.memorygame, name='memorygame'),
   
    path('meetourteam/', views.meetourteam, name='meetourteam'),
    path('word_game/', views.word_game, name='word_game'),
    path('position_game/', views.position_game, name='position_game'),
    path('get_followup_questions/', views.get_followup_questions, name='get_followup_questions'),
    
    
    path("process_answers/", views.process_answers, name="process_answers"),   #api로 연결된 답변 
    
     path('save_memory_record/', views.save_memory_record, name='save_memory_record'),  #기억 저장. 
     
     path('otherusers/', views.otherusers, name='otherusers'), #db에 있는키 꺼내오기 

    path('update_global_click/', views.update_global_click_count, name='update_global_click'), #저장,안저장 클릭 횟수 저장 하는 거 

     path('get_accuracy_stats/', views.get_accuracy_stats, name='get_accuracy_stats'),


]





    



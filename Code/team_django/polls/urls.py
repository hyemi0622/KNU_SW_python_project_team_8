# polls/urls.py

from django.urls import path
from . import views  # ← 꼭 이렇게 상대 경로로 import


   
   
    
urlpatterns = [
    path('index/', views.index, name='index'),
    path('chat/', views.chat, name='chat'),
    path('get_followup_questions/', views.get_followup_questions, name='get_followup_questions'),
    path("process_answers/", views.process_answers, name="process_answers"),  

]





    



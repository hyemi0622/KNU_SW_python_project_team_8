# polls/urls.py

from django.urls import path
from . import views  # ← 꼭 이렇게 상대 경로로 import



urlpatterns = [
    path('index/', views.index, name='index'),
    path('chat/', views.chat, name='chat'),
    path('fourpanel/', views.fourpanel, name='fourpanel'),
    path('memorygame/', views.memorygame, name='memorygame'),
    path('otherusers/', views.otherusers, name='otherusers'),
    path('memoryhome/', views.memory_home, name='memory_home'),
    path('wordgame/', views.word_game, name='word_game'),
    path('positiongame/', views.position_game, name='position_game'),



]


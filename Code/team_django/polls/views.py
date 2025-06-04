from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return render(request, 'polls/index.html')

def chat(request):
    return render(request, 'polls/chat.html')

def fourpanel(request):
    return render(request, 'polls/fourpanel.html')

def memorygame(request):
    return render(request, 'polls/memorygame.html')


def otherusers(request):
    return render(request, 'polls/otherusers.html')

def memory_home(request):
    return render(request, 'polls/memory_home.html')

def word_game(request):
    return render(request, 'polls/word_game.html')

def position_game(request):
    return render(request, 'polls/position_game.html')
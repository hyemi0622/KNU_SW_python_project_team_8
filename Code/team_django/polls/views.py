from django.shortcuts import render


# Create your views here.

from django.http import HttpResponse

def index(request):
    return render(request, 'polls/index.html')

def chat(request):
    return render(request, 'polls/chat.html')

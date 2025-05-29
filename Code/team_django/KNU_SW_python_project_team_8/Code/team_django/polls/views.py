from django.shortcuts import render

from django.http import JsonResponse
from .models import Question
import json
from django.views.decorators.csrf import csrf_exempt
# Create your views here.

#from django.http import HttpResponse

def index(request):
    return render(request, 'polls/index.html')

def chat(request):
    return render(request, 'polls/chat.html')


@csrf_exempt
def get_followup_questions(request):
    if request.method == "POST":
        data = json.loads(request.body)
        category = data.get("category")
        subcategory = data.get("subcategory", "").strip()

        if subcategory:
            # subcategory가 명시된 경우
            questions = Question.objects.filter(
                category=category,
                subcategory=subcategory
            ).order_by("order")
        else:
            # subcategory 없이 category만으로 조회
            questions = Question.objects.filter(
                category=category,
                subcategory=""
            ).order_by("order")

        question_list = [q.text for q in questions]
        return JsonResponse({"questions": question_list})

    return JsonResponse({"error": "POST 요청만 허용됩니다."}, status=405)


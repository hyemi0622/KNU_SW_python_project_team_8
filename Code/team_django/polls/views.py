from django.shortcuts import render
from django.http import JsonResponse
from .models import Question
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

import json
import traceback
from dotenv import load_dotenv

from openai import OpenAI  # ✅ 최신 방식: OpenAI 인스턴스 생성

# 환경 변수 불러오기
load_dotenv()

# ✅ OpenAI 인스턴스 초기화
client = OpenAI(api_key=settings.OPENAI_API_KEY)

# ---------- 기본 페이지 라우팅 ----------
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

def meetourteam(request):
    return render(request, 'polls/meetourteam.html')


# ---------- 질문 불러오기 ----------
@csrf_exempt
def get_followup_questions(request):
    if request.method == "POST":
        data = json.loads(request.body)
        category = data.get("category")
        subcategory = data.get("subcategory", "").strip()

        if subcategory:
            questions = Question.objects.filter(
                category=category,
                subcategory=subcategory
            ).order_by("order")
        else:
            questions = Question.objects.filter(
                category=category,
                subcategory=""
            ).order_by("order")

        question_list = [q.text for q in questions]
        return JsonResponse({"questions": question_list})

    return JsonResponse({"error": "POST 요청만 허용됩니다."}, status=405)


# ---------- 사용자 응답 처리 & GPT 응답 ----------
@csrf_exempt
def process_answers(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            category = data.get("category", "")
            subcategory = data.get("subcategory", "")
            qa_list = data.get("qa", [])

            prompt = f"""
당신은 감정 기반 기억 상담가입니다. 사용자는 어떤 기억을 떠올리고 싶어 하지만 스스로 잘 떠올리지 못하고 있습니다.

카테고리: {category}
세부 분류: {subcategory}

질문-답변 목록:
{json.dumps(qa_list, ensure_ascii=False, indent=2)}

당신은 이 정보만으로 사용자가 찾고자 하는 기억을 추론해서 알려줘야 합니다.  
**그리고 추론 결과를를 구체적으로 하나 제시해야 합니다.**  
만약 복수의 후보가 있을 경우, 5가지 정도의 선택지를 주세요.   
제목은 응답의 첫 줄에 굵게 제시해 주세요.  

"""

            # 최신 방식으로 GPT 호출
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "너는 사용자의 기억을 추론하는 상담가야."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000,
            )

            gpt_reply = response.choices[0].message.content
            print("🧠 GPT 응답:", gpt_reply)

            return JsonResponse({"summary": gpt_reply})

        except Exception as e:
            print("❌ 예외 발생:")
            traceback.print_exc()
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "POST 요청만 허용됩니다."}, status=405)

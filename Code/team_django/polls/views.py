from django.shortcuts import render
from django.http import JsonResponse
from .models import Question
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

# 아이디 부여를 위한. 
import uuid

import matplotlib
matplotlib.use('Agg') 
# 그래프 그리기 위한 
import matplotlib.pyplot as plt
import io
import base64


import json
import traceback
from dotenv import load_dotenv

from .models import MemoryRecord, GlobalClickCount


from openai import OpenAI  #  최신 방식: OpenAI 인스턴스 생성

# 환경 변수 불러오기
load_dotenv()

#  OpenAI 인스턴스 초기화
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

def word_game(request):
    return render(request, 'polls/word_game.html')

def position_game(request):
    return render(request, 'polls/position_game.html')

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
당신은 사람의 기억을 찾아주는 **기억 추론 AI**입니다.  
사용자는 어떤 대상을 잊었고, 그것이 무엇인지 알고 싶어합니다.

당신의 임무:
- 아래 질문-답변 리스트만을 바탕으로 사용자가 찾으려는 **기억 대상**을 하나 정확히 추론합니다.
- 반드시 **단정적으로 하나의 주 추론 결과**를 먼저 제시하세요.
- 이어서, **비슷한 후보 5개를 정확히 번호를 붙여(1~5)** 리스트 형태로 제공합니다.
- 출력 형식은 반드시 아래와 같이 따르세요. 형식을 절대 바꾸지 마세요.
- 콘텐츠를 선택한 경우 인물 이름, 캐릭터 이름 위주로 검색해주세요.
- 노래인 경우 가사, 가수 위주로 검색해주세요.
- 장소인 경우 각국의 랜드마크 위주로 찾아주세요.


입력 정보
카테고리: {category}  
세부 분류: {subcategory}

질문과 답변:
{json.dumps(qa_list, ensure_ascii=False, indent=2)}

출력 형식 (이 형식을 그대로 지켜야 합니다)
1의 대상명에 가장 결과로 추정 되는 걸 띄우고 2~4번에 순차적으로 가능성 있는 다른 후보를 띄워줘.
**기억 추론 결과: 

1. [정확한 대상명]
2. [정확한 대상명]
3. [정확한 대상명]
4. [정확한 대상명]
5. [정확한 대상명]
"""

            # 최신 방식으로 GPT 호출
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "너는 사용자의 기억을 추론하는 해결사야."},
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

# 결과 저장하기  

@csrf_exempt
def save_memory_record(request):
    print("=== process_answers called ===")
    if request.method == "POST":
        print("=== POST method received ===")
        data = json.loads(request.body)

        record = MemoryRecord.objects.create(
            category=data.get("category", ""),
            keyword=data.get("keyword", "")[:50],  # 50자 이내 제한
            qa_json=data.get("qa", []),
            summary=data.get("summary", "")
        )
    


        return JsonResponse({"id": str(record.id), "status": "saved"})

    return JsonResponse({"error": "POST only"}, status=405)


#저장된 결과 다시 화면에 띄우기 

def otherusers(request):
    records = MemoryRecord.objects.order_by('-created_at')
    row1 = records[0::4]
    row2 = records[1::4]
    row3 = records[2::4]
    row4 = records[3::4]

    return render(request, 'polls/otherusers.html', {
        'row1': row1,
        'row2': row2,
        'row3': row3,
        'row4': row4,
    })

@csrf_exempt
def get_memory_records(request):
    # 최신순(가장 최근에 저장한 것부터)으로 정렬
    records = MemoryRecord.objects.all().order_by('-id').values('id', 'keyword', 'summary')
    return JsonResponse(list(records), safe=False)




# 저장, 안저장 중  어떤 걸  클릭했는지 저장해주는 함수. 
# views.py


@csrf_exempt
def update_global_click_count(request):
    if request.method == "POST":
        data = json.loads(request.body)
        action = data.get("action")
        counter, _ = GlobalClickCount.objects.get_or_create(pk=1)
        if action == "save":
            counter.save_clicks += 1
        elif action == "dont_save":
            counter.dont_save_clicks += 1
        else:
            return JsonResponse({"error": "Invalid action"}, status=400)
        counter.save()
        return JsonResponse({
            "save_clicks": counter.save_clicks,
            "dont_save_clicks": counter.dont_save_clicks,
        })
    return JsonResponse({"error": "POST only"}, status=405)



# 절확도 계산
def get_accuracy_stats(request):
    counter = GlobalClickCount.objects.first()
    if not counter:
        return JsonResponse({"total": 0, "accuracy": 0})
    total = counter.save_clicks + counter.dont_save_clicks
    accuracy = 0
    if total > 0:
        accuracy = round(counter.save_clicks / total * 100, 1)
    return JsonResponse({
        "total": total,
        "accuracy": accuracy
    })


def get_accuracy_pie_image(request):
    counter = GlobalClickCount.objects.first()
    save = counter.save_clicks if counter else 0
    dont_save = counter.dont_save_clicks if counter else 0

    fig, ax = plt.subplots(figsize=(2, 2))
    ax.pie(
        [save, dont_save],
        labels=['accurate data', 'dummy'],
        colors=['#4CAF50', '#F44336'],
        autopct='%1.1f%%',
        startangle=90,
        counterclock=False
    )
    ax.axis('equal')

    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', transparent=True)
    plt.close(fig)
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()

    return JsonResponse({'image': image_base64})





from wordcloud import WordCloud


#  Mac 한글 폰트 설정 (matplotlib + wordcloud 모두 적용)
plt.rc('font', family='AppleGothic')
plt.rcParams['axes.unicode_minus'] = False

def get_wordcloud_image(request):
    # 저장된 summary 전체 불러오기
    summaries = MemoryRecord.objects.values_list('summary', flat=True)
    text = ' '.join(summaries) if summaries else 'No Data'

    # 한글 불용어 집합
    korean_stopwords = {
        "에게", "가", "는", "은", "을", "를", "에", "의", "에서", "으로", "로", "과", "와", "도", "만", "보다", "처럼",
        "까지", "부터", "하고", "이나", "라도", "마저", "조차", "든지", "이라도", "라든지", "께서", "한테", "밖에"
    }

    #  워드클라우드 생성 (Mac 내장 폰트 AppleGothic 사용)
    wordcloud = WordCloud(
        width=400,
        height=200,
        background_color='white',
        font_path='/System/Library/Fonts/Supplemental/AppleGothic.ttf',
        stopwords=korean_stopwords
    ).generate(text)

    # 이미지 → base64 변환
    buf = io.BytesIO()
    wordcloud.to_image().save(buf, format='PNG')
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()

    return JsonResponse({'image': image_base64})

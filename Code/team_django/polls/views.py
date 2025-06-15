from django.shortcuts import render
from django.http import JsonResponse
from .models import Question
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from wordcloud import WordCloud


from konlpy.tag import Okt # 자바환경에서 써야해서 사용 못함. 

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
from konlpy.tag import Okt
from .models import MemoryRecord, GlobalClickCount


from openai import OpenAI  #  최신 방식: OpenAI 인스턴스 생성

# 한글 폰트 지정. 


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

            valid_qa_list = [qa for qa in qa_list if qa.get("answer", "").strip()]

            if category == "장소":
                prompt = f"""

너는 사람들의 기억을 추론하는 AI야.  
사용자는 과거에 다녀온 **실제 장소**를 잊고 있으며, 지금 그 장소가 어디였는지 궁금해하고 있어.

🗂 질문과 답변:
{json.dumps(valid_qa_list, ensure_ascii=False, indent=2)}

✅ 임무:
1. 사용자의 답변을 기반으로, 가장 유력한 **실제 장소 이름 1개**를 추론하라.  
   - 장소명은 반드시 하나의 구체적이고 실제 존재하는 장소여야 한다.  
   - 두루뭉술하게 말하지 말고 단정적으로 말해라. 예: "한강공원", "북촌 한옥마을", "올림픽공원" 등
2. 추론 근거를 논리적으로 설명해라.
3. 마지막으로, 비슷한 장소 3~5곳을 추천하라.

📌 출력 형식:
**기억 추론 장소: [정확한 장소명]**  
- 설명: 왜 그 장소를 선택했는지 단서 기반 설명

**추천 후보 리스트:**
1. [장소명] - 설명
2. ...
"""
            elif category == "일정/할일":
                prompt = f"""
사용자는 자신이 까먹은 일정이나 할일을 기억하고 싶어 해.

🗂 질문과 답변:
{json.dumps(valid_qa_list, ensure_ascii=False, indent=2)}

너의 임무:
1. 과거 또는 미래에 있었던 중요한 일정/할일을 유추해.
2. 그럴듯한 대안 3~5가지를 함께 제시해줘.
"""
            elif category == "단어/문장":
                prompt = f"""
사용자는 까먹은 단어(또는 문장, 외국어 표현 등)을 떠올리고 싶어 해.

질문과 답변:
{json.dumps(valid_qa_list, ensure_ascii=False, indent=2)}

너의 임무:
1. 단서들을 보고 어떤 단어/문장을 떠올리는 지 유추해.
2. 가장 유력한 단어 1개와, 비슷한 단어 3~5개를 함께 제안해줘.
"""
            elif category == "콘텐츠":
                prompt = f"""
너는 사용자의 기억을 분석해주는 AI야. 사용자는 자신이 본 콘텐츠를 떠올리고 싶어 해.  
사용자의 답변 속에는 **배우 이름, 장면, 시기, 분위기**에 대한 정보가 포함되어 있어.


질문과 답변:
{json.dumps(valid_qa_list, ensure_ascii=False, indent=2)}

너의 임무는 다음과 같아:

1. 모든 단서를 종합해, 사용자가 기억하려는 **콘텐츠(드라마/영화 등) 하나**를 추론해.
   - 반드시 실제로 존재하는 콘텐츠여야 함.
   - 너무 조심스럽게 말하지 말고 단정적으로 말할 것.
   - 특히, 사용자의 응답 중 등장한 **배우의 이름이 있다면 반드시 반영하라.**

2. 이어서, **추천 콘텐츠 5가지**를 제시하라.
   - 그 중 최소 **2개 이상은 같은 배우가 출연한 작품이어야 한다.**
   - 나머지는 분위기나 장르, 시기 등이 유사한 콘텐츠로 구성하라.

📌 출력 형식:

**기억 추론 콘텐츠: [콘텐츠 제목]**  
- 설명: 왜 이 콘텐츠를 선택했는지 단서 기반 논리 설명

**추천 후보 리스트:**
1. [콘텐츠명] - (배우 이름 포함) 간단한 설명  
2. ...
"""
            elif category == "노래":
                prompt = f"""
사용자는 기억이 안 나는 노래를 찾고 싶어 해.

🗂 질문과 답변:
{json.dumps(valid_qa_list, ensure_ascii=False, indent=2)}

너의 임무:
1. 사용자의 설명을 보고 어떤 노래일지 추론해.
2. 비슷한 노래를 3~5개 제시해. 제목, 가수, 분위기 설명 포함.
"""
            elif category == "검색":
                prompt = f"""
사용자는 인터넷 검색으로 찾고 싶었던 대상을 기억해내려 하고 있어.
이 대상은 어떤 인물, 브랜드, 물건, 트랜드 등일 수 있어.

질문과 답변:
{json.dumps(valid_qa_list, ensure_ascii=False, indent=2)}

너의 임무:
1. 사용자가 과거에 검색하려 했던 키워드를 하나 유추해.
2. 비슷한 검색 대상 3~5개를 함께 제안해.
"""
            else:
                prompt = f"""
질문과 답변을 보고 사용자가 어떤 기억을 찾으려 하는지 추론해줘.

질문과 답변:
{json.dumps(valid_qa_list, ensure_ascii=False, indent=2)}
"""
            # 최신 방식으로 GPT 호출
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "너는 기억을 추론하는 전문가야. 사용자의 질문-응답을 분석해서 구체적인 노래, 장소, 콘텐츠 등을 추론하고 알려줘."},
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



# 정확도 차트
def get_accuracy_pie_image(request):
    counter = GlobalClickCount.objects.first()
    save = counter.save_clicks if counter else 0
    dont_save = counter.dont_save_clicks if counter else 0

    fig, ax = plt.subplots(figsize=(2, 2))
    ax.pie(
        [save, dont_save],
        labels=['save', 'not save'],
        colors=["#595A6F", "#8D6B68"],
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






#워드 클라우드 , 힌글 사용 가능하게 
plt.rc('font', family='MalgunGodic')
plt.rcParams['axes.unicode_minus'] = False



from wordcloud import WordCloud
# ... (생략) ...

def get_wordcloud_image(request):
    summaries = MemoryRecord.objects.values_list('summary', flat=True)
    text = ' '.join(summaries) if summaries else 'No Data'

    # 불용어 집합 정의
    korean_stopwords = {
        "에게", "가", "는", "은", "을", "를", "에", "의", "에서", "으로", "로", "과", "와", "도", "만", "보다", "처럼",
        "까지", "부터", "하고", "이나", "라도", "마저", "조차", "든지", "이라도", "라든지", "께서", "한테", "밖에"
    }

    wordcloud = WordCloud(
        width=400,
        height=200,
        background_color='white',
        font_path = 'C:/Windows/Fonts/malgun.ttf',
        stopwords=korean_stopwords
    ).generate(text)

    buf = io.BytesIO()
    wordcloud.to_image().save(buf, format='PNG')
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()
    return JsonResponse({'image': image_base64})

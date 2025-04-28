### 📝 회의 일시 : 4/28 (월) 4시30분

⚙️ 혜민: 장고 환경 설정 배워서 알려주기.<br>
🔧 가령:  기능 명세서 대략 작성해오기. (라이브러리 공부ing)<br>
🎨 혜미: 디자인 사이트 알아오기.(html,css 공부 ing) .<br>

#### 👥 회의 내용 

- 기능명세서 완성
- 장고 프레임워크 배우기 

---
### 🎨 혜미<br>
참고 할 웹디자인 사이트 : https://dribbble.com/ <br>
손쉽게 웹사이트 만들 수 있는 사이트1 : https://www.wix.com/ <br>
손쉽게 웹사이트 만들 수 있는 사이트2 : https://www.squarespace.com/ <br>
웹사이트 디자인 할 수 있는 사이트 : https://www.figma.com/ko-kr/<br>
직접 만들려면 ? : HTML, CSS, JavaScript 사용

#### 💡 Django에서 템플릿 만들고 웹사이트 연결시키는 방법 <br>
🛠️ 준비물 <br>
1. Python 설치 <br>
2. Django 설치 (명령어로 설치)
> pip install django

<br>




#### 🛤️ Django 기본 구조<br>
> 프로젝트 폴더/ <br>
│<br>
├── manage.py <br>
├── 프로젝트이름/ <br>
│   ├── settings.py <br>
│   └── urls.py <br>
└── 앱이름/ <br>
   &nbsp;&nbsp;&nbsp;├── views.py <br>
    &nbsp;&nbsp; ├── urls.py <br>
   &nbsp;&nbsp; └── templates/ <br>
       &nbsp; &nbsp;&nbsp;&nbsp;  └── 앱이름/ <br>
       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  └── index.html <br>

#### 🏗️ Django 흐름 요약
1. URL 요청<br>
2. views.py가 HTML 파일 호출<br>
3. templates 폴더 안 HTML 파일 보여줌<br>

>📄 views.py 작성<br>
from django.shortcuts import render<br>
def home(request):<br>
    &nbsp;&nbsp;&nbsp;return render(request, '앱이름/index.html', {'username': '지민'})<br>

💡 render(request, '앱이름/index.html', {데이터}) : HTML파일과 데이터를 연결해줘.<br>

> 📄 앱 내부 urls.py 작성<br>
from django.urls import path<br>
from . import views<br>
urlpatterns = [ <br>
&nbsp;&nbsp;&nbsp;path('', views.home, name='home'),<br>
]<br>

💡 path('', views.home, name='home') : 홈페이지에 접속하면 home함수를 실행! <br>

> 📄 templates/앱이름/index.html 작성 <br>
&lt;html&gt; <br>
&lt;!DOCTYPE html&gt; <br>
&lt;html lang="ko"&gt; <br>
&lt;head&gt; <br>
 &nbsp;&nbsp;   &lt;meta charset="UTF-8"&gt; <br>
  &nbsp;&nbsp;  &lt;title&lt;기억을 깨우는 AI - Django&lt;/title&gt; <br>
&lt;/head&gt; <br>
&lt;body&gt; <br>
  &nbsp;&nbsp;  &lt;h1&gt;환영합니다, {{ username }}님!&lt;/h1&gt; <br>
&lt;/body&gt; <br>
&lt;/html&gt; <br>

💡 Django도 {{ username }} 문법으로 데이터를 삽입함


#### ▶️ 서버 실행하기
> python manage.py runserver<br>
브라우저에서 http://127.0.0.1:8000/ 접속!
---
#### 가령 <br>

노션 링크 : https://www.notion.so/1befab33b89880939b40fba702632552?pvs=4



---

#### 혜민 <br>

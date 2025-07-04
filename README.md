### **🌸 Topic : 기억의 실마리를 쫓는 AI "그그그 뭐지"😁**  <br>
#### 🌐 고혜민(2023008036), 김가령(2023027213) , 정혜미(2023025757) 🌐<br><br>
👾 고혜민 : 게임 백엔드 <br>
👾 김가령 : 라이브러리, 데이터분석 백엔드 <br>
👾 정혜미 : 웹사이트 디자인, 프론트엔드, 게임 외 백엔드 <br>

#### 📌 프로젝트의 목적 및 주요 기능 설명 :
[![바로가기](https://img.shields.io/badge/%20바로가기-28a745)](./explanation/README.md)

#### 🖼️ 실행화면 :
[![바로가기](https://img.shields.io/badge/%20바로가기-28a745)](./DemoScreen/README.md)

#### 📥 PPT 내용 :
[![바로가기](https://img.shields.io/badge/%20바로가기-28a745)](./PPT/README.md)

#### 🚀 설치 및 실행 방법 :
[![바로가기](https://img.shields.io/badge/%20바로가기-28a745)](./Installation&Execution/README.md)

#### 💡 기술 스택  & 사용된 라이브러리 :
[![바로가기](https://img.shields.io/badge/%20바로가기-28a745)](StackTech) 

#### 📖 템플릿 :
[![바로가기](https://img.shields.io/badge/%20바로가기-28a745)](Template)

#### 🧪 시행착오 및 발전방향 :
[![바로가기](https://img.shields.io/badge/%20바로가기-28a745)](Trial&error)

#### ✨ 배포된 사이트 :<br>
[![사이트로 바로 가기](https://img.shields.io/badge/%20사이트로_바로가기-5C4033)](http://18.116.20.223:8000/)


#### 🗓️ 주차별 리스트 (내용 버튼 클릭하면 해당 페이지로 이동합니다.) :








| 주차                           | 📋내용                | 👩 고혜민             | 👩 김가령            | 👩 정혜미              | 📈진행     |
| :---------------------------: | :---------------------: | :-----------------:  | :---------------:  | :---------------------: | :---------: |
| 1주차     | [![1주차 내용](https://img.shields.io/badge/1주차_내용-60a5fa)](https://github.com/hyemi0622/KNU_SW_python_project_team_8/tree/main/Week/1st_Week) | 게임 형식 조사  | 기능 명세서 작성 / 사용 라이브러리 조사     | 참고할 디자인 사이트 조사 / 웹디자인 공부  |![status](https://img.shields.io/badge/Finish%20-009000) |
| 2주차 | [![2주차 내용](https://img.shields.io/badge/2주차_내용-60a5fa)](https://github.com/hyemi0622/KNU_SW_python_project_team_8/tree/main/Week/2nd_Week) | Django 환경 설정 공유 | 라이브러리 조사 + 응용 | 디자인 명세서 작성, 프롬프트 부분 약간 구현 |![status](https://img.shields.io/badge/Finish%20-009000) |
| 3주차 |  [![3주차 내용](https://img.shields.io/badge/3주차_내용-60a5fa)](https://github.com/hyemi0622/KNU_SW_python_project_team_8/tree/main/Week/3rd_Week) | 게임 조사 + 방향 설정 | chat 기능 개발 | 웹사이트 디자인 / chat 화면 개발 |![status](https://img.shields.io/badge/Finish%20-009000) |
| 4주차 | [![4주차 내용](https://img.shields.io/badge/4주차_내용-60a5fa)](https://github.com/hyemi0622/KNU_SW_python_project_team_8/tree/main/Week/4th_Week)  | 단어 찾기 게임 개발 | chat과 API 연동 | What is? 부분 개발 /  |![status](https://img.shields.io/badge/Finish%20-009000) |
| 5주차 | [![5주차 내용](https://img.shields.io/badge/5주차_내용-60a5fa)](https://github.com/hyemi0622/KNU_SW_python_project_team_8/tree/main/Week/5th_Week)  | 위치 찾기 게임 개발 |  Django로 사용자 기록 db 연동 | 웹사이트 Meet The Team, Remember Other users 파트 개발  |![status](https://img.shields.io/badge/Finish%20-009000) |
| 6주차 | [![6주차 내용](https://img.shields.io/badge/6주차_내용-60a5fa)](https://github.com/hyemi0622/KNU_SW_python_project_team_8/tree/main/Week/6th_Week)  | 게임 오류 나는 부분 수정 |  AWS로 서버 연동 |  Memory Game 파트 디자인 수정 / 오류 나는 부분들 수정  |![status](https://img.shields.io/badge/Finish%20-009000) |
| 7주차 | [![7주차 내용](https://img.shields.io/badge/7주차_내용-60a5fa)](https://github.com/hyemi0622/KNU_SW_python_project_team_8/tree/main/Week/7th_Week)  | 발표 대본 만들기 | 발표 대본 만들기 | PPT 만들기  |![status](https://img.shields.io/badge/Finish%20-009000) |

---
### 📁 프로젝트 구조
```markdown
├── mysite/                     # Django 설정 디렉토리
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── polls/                      # 메인 앱 디렉토리
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   ├── urls.py
│   ├── views.py
│   ├── migrations/
│   │   ├── __init__.py
│   │   ├── 0001_initial.py
│   │   ├── 0002_alter_question_category.py
│   │   ├── ...
│   ├── scripts/
│   └── templates/polls/        # 템플릿 폴더 (HTML 파일)
│       ├── chat.html
│       ├── fourpanel.html
│       ├── index.html
│       ├── meetourteam.html
│       ├── memorygame.html
│       ├── otherusers.html
│       ├── position_game.html
│       └── word_game.html
│
├── static/                     # 정적 파일 (CSS, JS, 이미지 등)
│   ├── css/
│   │   ├── chat.css
│   │   ├── fourpanel.css
│   │   ├── meetourteam.css
│   │   ├── otherusers.css
│   │   └── style.css
│   ├── data/
│   │   ├── position_game_levels.json
│   │   └── word_game_levels.json
│   ├── images/ # 이미지가 믾아서 생략
│   └── js/
│       ├── chat.js
│       ├── fourpanel.js
│       ├── meetourteam.js
│       ├── otherusers.js
│       ├── position_game.js
│       └── word_game.js
│
├── .gitignore
├── insert_questions.py         # 질문 데이터를 삽입하는 스크립트로 추정
├── manage.py                   # Django 명령어 실행 진입점
└── questions_all_categories.csv # 질문 카테고리 데이터
```

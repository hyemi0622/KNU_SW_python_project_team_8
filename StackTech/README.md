# 🛠️ 기술 스택

본 프로젝트 **"그그그 뭐지?"** 는 잊힌 기억을 회복하도록 돕는 AI 챗봇 웹 서비스입니다.  
AI 응답 생성부터 사용자 인터페이스, 서버 배포까지 전 과정을 Django와 AWS 기반으로 구성하였습니다.

---

## 🧩 전체 아키텍처 구성도

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Django (Python)
- **AI 응답 생성**: OpenAI GPT-3.5 API
- **데이터 저장**: SQLite (Django 기본 DB)
- **배포**: AWS EC2

---

## 🔧 세부 기술 구성

| 범주         | 기술/서비스         | 설명 |
|--------------|---------------------|------|
| 백엔드       | **Django**          | Python 기반 웹 프레임워크. URL 라우팅, 모델, 뷰 처리 |
| 데이터 저장  | **SQLite**          | Django 기본 내장형 경량 DB. 로컬 개발 및 소규모 서비스에 적합 |
| AI 응답 생성 | **OpenAI GPT-3.5**  | 기억 단서를 바탕으로 자연스러운 대화 응답 및 요약 생성 |
| 배포         | **AWS EC2**         | Django 프로젝트를 EC2 리눅스 인스턴스에 배포하여 직접 운영 |

---

## 🧪 사용한 외부 라이브러리

| 라이브러리       | 설명 |
|------------------|------|
| `openai`         | OpenAI API 호출용 공식 Python SDK |
| `requests`       | 외부 API 연동 및 HTTP 통신 처리 |
| `gunicorn`       | EC2 배포 시 사용한 WSGI 서버 |
| `whitenoise`     | 정적 파일(Django static) 서빙 최적화 |
| `python-dotenv`  | 환경변수(.env)로 API 키 등 민감 정보 관리 |

---

## ☁️ 배포 환경

- AWS EC2 리눅스 인스턴스에 Django 프로젝트 배포
- `gunicorn`을 통한 애플리케이션 실행
- 정적 파일은 `collectstatic` 후 `whitenoise`로 서빙
- 보안: `.env` 파일로 OpenAI 키 등 민감 정보 관리
- 웹 서버 설정 및 HTTPS는 선택적으로 구성 가능

---.

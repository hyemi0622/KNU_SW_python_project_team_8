## 🛠️ 프로젝트 설치 및 실행 방법

로컬 환경에서 이 프로젝트를 실행하려면 아래 단계를 순서대로 따라주세요.

---

### 📥 1. 저장소 클론

```bash
git clone https://github.com/hyemi0622/KNU_SW_python_project_team_8.git
cd KNU_SW_python_project_team_8
```
### 🐍 2. 가상환경 생성 및 활성화 (Windows 기준)
```bash
python -m venv venv
venv\Scripts\activate
# macOS/Linux 사용자는 아래 명령어를 사용하세요 : 💡 source venv/bin/activate
```
### 📦 3. 필수 패키지 설치
```bash
pip install django
pip install openai
pip install python-dotenv
```
### ⚙️ 4. 마이그레이션 및 서버 실행
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```
#### 🔐 .env 설정 
OPENAI_API_KEY="your_openai_api_key_here" // 키 유출되면 큰일나요

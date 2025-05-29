# insert_questions.py

import csv
from pathlib import Path
from polls.models import Question  # ← 앱 이름 'polls'로 정확히 지정

csv_path = Path("questions_all_categories.csv")  # 이 파일도 같은 폴더에 있어야 함

with csv_path.open(newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        Question.objects.create(
            category=row['category'],
            subcategory=row['subcategory'],
            order=int(row['order']),
            text=row['text']
        )

print("✅ 질문 데이터가 성공적으로 추가되었습니다.")

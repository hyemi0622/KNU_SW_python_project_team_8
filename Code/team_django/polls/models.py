from django.db import models

class Question(models.Model):
    CATEGORY_CHOICES = [
        ('장소/경험', '장소/경험'),
        ('일정/할일', '일정/할일'),
        ('단어', '단어'),
        ('콘텐츠', '콘텐츠'),
        ('꿈', '꿈'),
        ('기타', '기타'),
    ]

    SUBCATEGORY_CHOICES = [
        ('', '없음'),
        ('영화', '영화'),
        ('노래', '노래'),
        ('드라마', '드라마'),
        ('애니메이션', '애니메이션'),
        ('학교', '학교'),
        ('회사', '회사'),
        ('알바', '알바'),
        ('기타', '기타'),
    ]

    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        verbose_name="기억 카테고리"
    )
    subcategory = models.CharField(
        max_length=20,
        choices=SUBCATEGORY_CHOICES,
        blank=True,
        verbose_name="세부 분류"
    )
    order = models.IntegerField(verbose_name="질문 순서 (Q2~Q15)")
    text = models.TextField(verbose_name="질문 내용")

    def __str__(self):
        sub = self.subcategory if self.subcategory else '기본'
        return f"[{self.category}/{sub}] Q{self.order}: {self.text}"

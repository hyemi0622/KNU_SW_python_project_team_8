from django.contrib import admin
from .models import Question,MemoryRecord, GlobalClickCount

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('category', 'subcategory', 'order', 'text')
    list_filter = ('category', 'subcategory')
    search_fields = ('text',)



# 이걸 추가해서 save, don't save 횟수 계산 -> 그걸로 정확률 계산 

admin.site.register(MemoryRecord)
admin.site.register(GlobalClickCount)


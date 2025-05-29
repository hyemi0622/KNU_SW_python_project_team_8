from django.contrib import admin
from .models import Question

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('category', 'subcategory', 'order', 'text')
    list_filter = ('category', 'subcategory')
    search_fields = ('text',)

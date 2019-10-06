from django.urls import path
from .api import TextSummarizedApi

app_name = "testing"
# app_name will help us do a reverse look-up latter.
urlpatterns = [
    path('summarize/', TextSummarizedApi.as_view()),
]
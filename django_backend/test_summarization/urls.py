from django.urls import path
from .views import TextSummarizedApi, UserApi

app_name = "testing"
# app_name will help us do a reverse look-up latter.
urlpatterns = [
    path('summarize/', TextSummarizedApi.as_view()),
    path('users/', UserApi.as_view()),
    # path('currentUser/', current_user)
]
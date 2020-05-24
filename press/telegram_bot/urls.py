from django.urls import path, re_path
from .views import UpdateBot
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('', csrf_exempt(UpdateBot.as_view()), name='update')
]
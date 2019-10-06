from django.http import HttpResponse
from django.contrib.auth.models import User


def index(request):
    if request.user.is_authenticated:
        return HttpResponse(request.user.username)
    else:
        return HttpResponse('WELCOME')
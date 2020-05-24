from django.contrib import admin

from .models import Profile, SavedText, TelegramProfile

admin.site.register(Profile)
admin.site.register(SavedText)
admin.site.register(TelegramProfile)

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

import json
import random
import string
from datetime import datetime, timedelta


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.PROTECT, null=False)
    email_confirmed = models.BooleanField(default=False)
    is_premium = models.BooleanField(default=False)
    summarized_texts = models.IntegerField(default=0)
    summarized_words = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        TelegramProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
    instance.telegramprofile.save()


class SavedText(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    text_json = models.TextField(default=None)
    main_indexes = models.TextField(default=None)
    text_hash = models.TextField(default=None)
    number_of_summarized_sentences = models.IntegerField(default=None)
    datetime_of_creation = models.DateTimeField(default=datetime.now())
    word_difference = models.IntegerField(default=None)

    def __str__(self):
        return self.text_hash


class TelegramProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.PROTECT, null=False)
    chat_id = models.CharField(max_length=50, default=None, null=True, blank=True, unique=True)
    activation_code = models.CharField(max_length=50, default=None, unique=True, null=True, blank=True)
    active_to = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.user.username

    def generate_code(self):
        lettersAndDigits = string.ascii_uppercase + string.digits
        code = ''.join((random.choice(lettersAndDigits) for i in range(8)))
        try:
            self.activation_code = code
            self.active_to = (datetime.now(tz=timezone.utc)  + timedelta(hours=1))
            self.save()
        except:
            generate_code(self)
         

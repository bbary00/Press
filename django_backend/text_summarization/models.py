import datetime
from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class UserAccount(models.Model):
    user_id = models.OneToOneField(User, on_delete=models.CASCADE)
    account_type = models.CharField(max_length=40, blank=True)


# TODO separate original text and summarized
class SummarizedText(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.SET_DEFAULT, default=None)
    full_text = models.TextField(default=None)
    summarized_text = models.TextField(default=None)
    summarized_text_length_in_percentage = models.FloatField(default=None)
    number_of_summarized_sentences = models.IntegerField(default=None)
    text_category = models.CharField(max_length=40, default=None)
    text_title = models.CharField(max_length=500, default=None)
    is_saved = models.BinaryField(default=0)
    datetime_of_creation = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return self.full_text[:20]

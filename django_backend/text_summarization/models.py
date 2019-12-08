import datetime
from django.db import models
from django.contrib.auth.models import User


class SummarizedText(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    full_text = models.TextField(default=None)
    summarized_text = models.TextField(default=None)
    number_of_summarized_sentences = models.IntegerField(default=None)
    datetime_of_creation = models.DateTimeField(default=datetime.datetime.now)
    word_difference = models.IntegerField(default=None)

    def __str__(self):
        return self.full_text[:20]

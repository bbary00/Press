import os
from celery import Celery


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'TextSummarizer.settings')
os.environ.setdefault('FORKED_BY_MULTIPROCESSING', '1')

app = Celery(app='TextSummarizer')

app.config_from_object('django.conf:settings', )
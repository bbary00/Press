from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.main, name='main'),
    path('login/', views.login, name='login'),
    path('save/', views.save, name='save'),
    path('logout/', views.logout, name='logout'),
    path('signup/', views.signup, name='signup'),
    path('cabinet/', views.cabinet, name='cabinet'),
    path('delete/<int:text_id>/', views.delete, name='delete'),
    path('cabinet/<int:text_id>/', views.cabinet, name='text'),
    path('telegram_code/', views.generate_telegram_code, name='tele_code'),
    path('change_password/', views.change_password, name='change_password'),
    path('send_activation/', views.send_activation, name='send_activation'),
    path('account_activation_sent/', views.account_activation_sent, name='account_activation_sent'),
    re_path(r'^activate/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', views.activate, name='activate'),
]
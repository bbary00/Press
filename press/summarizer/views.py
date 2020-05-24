from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.shortcuts import render, redirect, render_to_response
from django.template.loader import render_to_string
from django.contrib.auth import authenticate
from django.contrib.auth import login as django_login
from django.contrib.auth import logout as django_logout
from django.db.models import Q
from django.contrib.auth.decorators import login_required
from django.utils import timezone


from .forms import MainForm, SignUpForm, LoginForm, MainTextForm, TelegramCodeForm
from core.Press import Press
from .models import Profile, SavedText, TelegramProfile
from .tokens import account_activation_token
from datetime import datetime
import hashlib
import secrets
import string
import itertools
import json


def login(request):
    if request.method == 'POST':
        user_credential = request.POST['email']
        password = request.POST['password']
        try: 
            user = User.objects.filter(Q(username__iexact=user_credential) | Q(email__iexact=user_credential)).first()
            user = authenticate(request, username=user.username, password=password)
            if not user:
                raise
        except:
            return JsonResponse({
                'message': 'Користувач з такими даними не знайдений!', 
                "success": False,
                "forget_password": True
            })
        django_login(request, user)
        return JsonResponse({"success": True})
        

def logout(request):
    django_logout(request)
    return redirect('main')


@login_required(login_url='/')
def save(request):
    template_data = {
        "main_form": MainForm(initial={"number_of_percent": 30}),
        "maxlength": ""
    }
    text = request.POST['text']
    text_hash = hashlib.sha256(text.encode()).hexdigest()
    textJSON = request.POST['output']
    main_indexes = json.loads(request.POST['main_indexes'])
    if SavedText.objects.filter(user=request.user, text_hash=text_hash).first():
        template_data["main_form"].initial = {
            "number_of_percent": request.POST['number_of_percent'], 
            "text": text, 
            "with_context": request.POST.get('with_context', False),
        }
        template_data["output"] = textJSON
        template_data["with_context"] = request.POST.get("with_context", False)
        template_data["messages"] = ["You've already saved this text!"]
        return render(request, "summarizer/main.html", template_data)
    summarized_text = [sent for id, sent in json.loads(textJSON).items() if id in main_indexes]
    saved_text = SavedText(
        user = request.user,
        text_json = textJSON,
        text_hash = text_hash,
        number_of_summarized_sentences = len(summarized_text),
        word_difference = len(text.split(' ')) - len(" ".join(summarized_text).split(" ")),
        main_indexes = request.POST['main_indexes']
    )
    template_data["main_form"].initial =initial={
        'output': textJSON, 
        "number_of_percent": request.POST['number_of_percent'], 
        "text": text, 
        "with_context": request.POST.get('with_context', False)
    }
    template_data["output"] = summarized_text
    template_data["with_context"] = request.POST.get("with_context", False)
    try:
        saved_text.save()
        template_data["messages"] = ["Text is saved!"]
    except:
        template_data["messages"] = ["Error"]
    return render(request, "summarizer/main.html", template_data)
    

@login_required(login_url='/')
def delete(request, text_id):
    text = SavedText.objects.filter(id=text_id, user=request.user).first()
    if not text:
        return render(request, "summarizer/cabinet.html", {'messages': ["Текст не знайдено!"]})
    text.delete()
    return redirect('cabinet')


def account_activation_sent(request):
    return render(request, 'summarizer/account_activation_sent.html')

@login_required(login_url='/')
def generate_telegram_code(request):
    telegram_profile = request.user.telegramprofile
    if not (telegram_profile.activation_code and telegram_profile.active_to > datetime.now(tz=timezone.utc)):
        telegram_profile.generate_code()
    code = telegram_profile.activation_code
    form = TelegramCodeForm(initial={'code': code})
    return render(request, "summarizer/cabinet.html", {"form": form})


def activate(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.profile.email_confirmed = True
        user.save()
        django_login(request, user)
        return redirect('main')
    else:
        return main(request, messages=["Активуюча силка неактивна"])


def signup(request):
    if request.method == 'POST':
        try:
            form = SignUpForm(request.POST)
            if form.is_valid():
                user = form.save(commit=False)
                user.is_active = False
                user.save()
                return send_activation(request, user)
            else:
                user = User.objects.filter(email=request.POST.get("email", "")).first()
                return JsonResponse({
                    "success": False, 
                    "messages": list(itertools.chain(form.errors.values())), 
                    "send_activation": user and not user.profile.email_confirmed
                })
        except Exception as error:
            print(error) 
            

def change_password(request):
    if request.method == 'POST':
        user_credential = request.POST['email']
        user = User.objects.filter(Q(username__iexact=user_credential) | Q(email__iexact=user_credential)).first()
        if not user:
            return JsonResponse({
                'message': 'Користувач з такими даними не знайдений!', 
                "success": False,
                "forget_password": True
            })
        alphabet = string.ascii_letters + string.digits
        new_password = ''.join(secrets.choice(alphabet) for i in range(10))
        user.set_password(new_password)
        user.save()
        current_site = get_current_site(request)
        subject = 'Activate Your Press Account'
        message = render_to_string('summarizer/change_password.html', {
            'user': user,
            'password': new_password
        })
        user.email_user(subject, message)
        return JsonResponse({"success": True, 'message': "Новий пароль було надіслано на вашу пошту!"})

def send_activation(request, user=None):
    if not user and request.method == 'POST':
        user = User.objects.filter(email=request.POST.get("email", ""), is_active=False).first()
        if not user:
            return JsonResponse({"success": False, "messages": ["Користувач не знайдений або вже активний."]})
    if not user.profile.email_confirmed:
        current_site = get_current_site(request)
        subject = 'Activate Your Press Account'
        message = render_to_string('summarizer/account_activation_email.html', {
            'user': user,
            'domain': current_site.domain,
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            'token': account_activation_token.make_token(user),
        })
        user.email_user(subject, message)
        return JsonResponse({"success": True, "message": "Силка на активацію була надіслана на ваш емейл!"})
    else: 
        return JsonResponse({"success": False, "messages": ["Користувач не знайдений або активний."]})
        

@login_required(login_url='/')
def cabinet(request, text_id=None):
    if text_id:
        text = SavedText.objects.filter(id=text_id, user=request.user).first()
        if not text:
            return render(request, "summarizer/cabinet.html", {'messages': ["Summary not found!"]})
        main_indexes = [str(i) for i in json.loads(text.main_indexes)]
        text = json.loads(text.text_json)
        main_text = " ".join([sent for id, sent in text.items() if id in main_indexes])
        form = MainTextForm(initial={"main_text": main_text})
        context = {
            "output": text, 
            "main_indexes": main_indexes, 
            "id": text_id,
            "hidden_form": form
        }
        return render(request, "summarizer/cabinet.html", context)
    else:
        texts = SavedText.objects.filter(user=request.user).values_list('id', 'text_json')
        texts = [(text[0], json.loads(text[1])["0"]) for text in texts]
        context = {"texts": texts}
        return render(request, "summarizer/cabinet.html", context)

    
def main(request, messages=[]):
    template_data = {
        "main_form": MainForm(initial={"number_of_percent": 30}),
        "maxlength": "",
        "messages": messages
    }
    
    if not request.user.is_authenticated:
        template_data["login_form"] = LoginForm()
        template_data["sign_up_form"] = SignUpForm()
        template_data["maxlength"] = "maxlength:2000"

    if request.method == "POST":
        data = {
            'text_to_press': request.POST['text'],
            'number_of_sentences_to_output': int(request.POST['number_of_sentence']),
        }
        summarized_text, sentence_indexes_to_output = Press(**data)
        template_data["main_form"].initial = {
            "number_of_percent": request.POST['number_of_percent'], 
            "text": data["text_to_press"], 
            "with_context": request.POST.get('with_context', False),
            "output": json.dumps(summarized_text, ensure_ascii=False),
            "main_indexes": f"{sentence_indexes_to_output}"
        }
        template_data["output"] = summarized_text
        template_data["main_indexes"] = sentence_indexes_to_output
        template_data["with_context"] = bool(request.POST.get("with_context", False))


    return render(request, "summarizer/main.html", template_data)
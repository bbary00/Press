from django.views import View
from django.utils import timezone
from django.http import HttpResponse

import json
import random
import requests
from .helpers import *
from core.Press import Press
from datetime import datetime
from telebot import AsyncTeleBot, types
from summarizer.models import SavedText


bot = AsyncTeleBot("1263280130:AAE8Nz5epRXsBZPgAHlRrjXXA5SWRdRog-Q")
# https://api.telegram.org/bot1263280130:AAE8Nz5epRXsBZPgAHlRrjXXA5SWRdRog-Q/setWebhook?url=https://60e5610e.ngrok.io/telegram_web_hook

class UpdateBot(View):
    def post(self, request):
        json_str = request.body.decode('utf-8')
        update = types.Update.de_json(json_str)
        log_message(update)
        bot.process_new_updates([update])
        return HttpResponse()


@bot.message_handler(commands=['start'])
def start_message(message):
    telegram_profile = get_telegram_profile(message)
    keyboard = types.ReplyKeyboardMarkup(one_time_keyboard=True, resize_keyboard=True)
    key_who_am_i = types.KeyboardButton(text=vocab["who_am_i"])
    keyboard.add(key_who_am_i)
    if not telegram_profile:
        key_register = types.KeyboardButton(text=vocab["sign_in"])
        keyboard.add(key_register)
    else:
        key_saved_text = types.KeyboardButton(text=vocab["saved_texts"])
        abstract_text = types.KeyboardButton(text=vocab["abstract_text"])
        keyboard.add(key_saved_text)
        keyboard.add(abstract_text)
    bot.send_message(message.chat.id, text=random.choice(vocab["hello"]), reply_markup=keyboard)


@bot.message_handler(func=lambda message: message.reply_to_message)
def handle_reply(message):
    telegram_profile = get_telegram_profile(message)
    if message.reply_to_message.text == vocab["send_code"]:
        if telegram_profile:   
            bot.send_message(message.chat.id, vocab["already_registered"])
            return
        activation_profile = TelegramProfile.objects.filter(activation_code=message.text).first()
        if activation_profile and activation_profile.active_to > datetime.now(tz=timezone.utc):
            try:
                activation_profile.chat_id = message.chat.id
                activation_profile.activation_code = None
                activation_profile.save()  
                bot.send_message(message.chat.id, vocab["is_signed_in"] % activation_profile.user.username)
            except Exception as error:
                bot.send_message(message.chat.id, vocab["sign_in_error"] % str(error))
        else:
            bot.send_message(message.chat.id, vocab["wrong_code"])
            markup = types.ForceReply()
            bot.send_message(message.chat.id, vocab["send_code"], reply_markup=markup)
    elif message.reply_to_message.text == vocab["send_abstract"]:
        bot.send_chat_action(message.chat.id, "typing")
        response = requests.post('http://127.0.0.1:8565/', json={"text": message.text})
        bot.send_message(message.chat.id, response.text)
    else:
        bot.send_message(message.chat.id, vocab["what"])


@bot.message_handler(func=lambda message: True, content_types=['text'])
def handle_text_doc(message):
    telegram_profile = get_telegram_profile(message)
    if len(message.text) < 50:
        if message.text == vocab["sign_in"]:
            sign_in(message)
        elif message.text == vocab["who_am_i"]:
            who_am_i(telegram_profile, message)
        elif message.text == vocab["saved_texts"]:
            saved_texts(message)
        elif message.text == vocab["abstract_text"]:
            abstract_text(message)
        else:                       
            bot.send_message(message.chat.id, vocab["too_short"])
    else: 
        if len(message.text) > 2000 and not telegram_profile:       
            bot.reply_to(message, text=vocab["please_register"])
        else:
            bot.send_chat_action(message.chat.id, "typing")
            summarized_text, sentence_indexes_to_output = Press(message.text, max(1, len(message.text)//1000))
            text = " ".join([summarized_text[i] for i in sentence_indexes_to_output])
            bot.send_message(message.chat.id, text=text)


@bot.callback_query_handler(func=lambda call: True)
def callback_query(call):
    if call.data == "sign_in":
        bot.delete_message(call.message.chat.id, call.message.message_id)
        markup = types.ForceReply()
        bot.send_message(call.message.chat.id, vocab["send_code"], reply_markup=markup)
    elif ">" in call.data:
        bot.delete_message(call.message.chat.id, call.message.message_id)
        saved_texts(call.message, int(call.data.split(">")[1].strip()))
    elif "<" in call.data:
        bot.delete_message(call.message.chat.id, call.message.message_id)
        saved_texts(call.message, int(call.data.split("<")[0].strip()))



def sign_in(message):
    markup = types.ForceReply()
    bot.send_message(message.chat.id, vocab["send_code"], reply_markup=markup)


def abstract_text(message):
    markup = types.ForceReply()
    bot.send_message(message.chat.id, vocab["send_abstract"], reply_markup=markup)


def who_am_i(telegram_profile, message):
    if telegram_profile:
        bot.send_message(message.chat.id, f"{telegram_profile.user.username}")
    else:
        markup = types.InlineKeyboardMarkup()  
        markup.row_width = 2 
        key_url = types.InlineKeyboardButton(text=vocab["generate_code"], url="https://880a79da.ngrok.io/cabinet/")
        key_sign_in = types.InlineKeyboardButton(vocab["sign_in"], callback_data="sign_in")
        markup.add(key_url)     
        markup.add(key_sign_in)        
        bot.send_message(message.chat.id, text=vocab["who_are_you"], reply_markup=markup)


def saved_texts(message, id=1):
    telegram_profile = get_telegram_profile(message)
    if telegram_profile:
        saved_texts = SavedText.objects.filter(user=telegram_profile.user.id)
        if saved_texts:
            markup = types.InlineKeyboardMarkup()  
            markup.row_width = 2 

            if len(saved_texts) == 1:
                current = types.InlineKeyboardButton(text="1", callback_data="-")
                markup.add(current)
            elif id == 1:
                current = types.InlineKeyboardButton(text=f"{id}", callback_data="-")
                next = types.InlineKeyboardButton(text=f" -> {id+1} ", callback_data=f" -> {id+1} ")
                markup.add(current, next)
            elif id == len(saved_texts):
                previous = types.InlineKeyboardButton(text=f" {id-1} <- ", callback_data=f" {id-1} <- ")
                current = types.InlineKeyboardButton(text=f"{id}", callback_data="-")
                markup.add(previous, current)
            else:
                previous = types.InlineKeyboardButton(text=f" {id-1} <- ", callback_data=f" {id-1} <- ")
                current = types.InlineKeyboardButton(text=f"{id}", callback_data="-")
                next = types.InlineKeyboardButton(text=f" -> {id+1} ", callback_data=f" -> {id+1} ")
                markup.add(previous, current, next)
            saved_text = saved_texts[id-1]
            main_indexes = [str(i) for i in json.loads(saved_text.main_indexes)]
            text = json.loads(saved_text.text_json)
            main_text = " ".join([sent for id, sent in text.items() if id in main_indexes])      
            bot.send_message(message.chat.id, text=main_text[:3000], reply_markup=markup)
        else:
            bot.send_message(message.chat.id, text=vocab["saved_not_found"])
    else:
        bot.send_message(message.chat.id, text=vocab["wtf"])

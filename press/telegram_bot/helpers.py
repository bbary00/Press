from datetime import datetime
from summarizer.models import TelegramProfile


vocab = {
    "sign_in": 'Увійти',
    "who_am_i": 'Хто я',
    "hello": ["Привіт)", "Радий бачити!"],
    "send_code": "Надішли свій код:",
    "already_registered": "Хей, а ти вже зареєстрований! Вважаєш, що тут якась помилка? КНОПКА",
    "is_signed_in": "Привіт %s! Насолоджуйся перевагами зареєстрованого користувача!",
    "sign_in_error":  "Сталася помилка(\nСпробуй створити новий код в кабінеті та спробуй ще раз! %s",
    "wrong_code": "Код не знайдено або він вже неактивний! Створи новий код в кабінеті та спробуй ще раз!",
    "what": "Незрозумів((",
    "abstract_text": "Абстрактне самері (beta)",
    "send_abstract": "Надсилай свій текст",
    "generate_code": 'Генерація коду',
    "saved_not_found": 'Збережених текстів не знайдено',
    "wtf": "Хмм як ти тут опинився?)",
    "who_are_you": "Мені також цікаво хто ти)",
    "too_short": "Ну куда тут ще скорочувати?))",
    "saved_texts": "Збережені тексти",
    "please_register": "Я бачу ти досі не зареєстрований користувач :(\nПора вже зареєструватися і використовувати всі можливості!"
}

def log_message(update):
    if not update.message:
        message = update.callback_query.message.json
    else:
        message = update.message.json
    with open("log.txt", "a") as file:
        file.write("\n".join([
            datetime.fromtimestamp(message["date"]).strftime("%A, %B %d, %Y %I:%M:%S"),
            str(message["message_id"]), 
            str(message["chat"]["id"]),
            f"{message['chat'].get('first_name', '***')} {message['chat'].get('last_name', '**')} {message['chat'].get('username', '*')}",
            message.get("text", "").replace("\n\n", "\n")
        ]))
        file.write("\n" + "-"*50 + "\n")


def get_telegram_profile(message):
    return TelegramProfile.objects.filter(chat_id=message.chat.id).first()
from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm


class MainForm(forms.Form):
    text = forms.CharField(label='Your text', widget=forms.Textarea(attrs={'id': 'summary_text'}))
    number_of_percent = forms.IntegerField(label='Sentenses', widget=forms.NumberInput(attrs={'type':'range', 'step': '2', 'min': 1, 'max': 100}))
    number_of_sentence = forms.IntegerField(widget = forms.HiddenInput(), required = False)
    output = forms.CharField(widget = forms.HiddenInput(), required = False)
    main_indexes = forms.CharField(widget = forms.HiddenInput(), required = False)
    with_context = forms.BooleanField(required=False, initial=False, label='With context')


class MainTextForm(forms.Form):
    main_text = forms.CharField(required = False, widget = forms.HiddenInput())


class TelegramCodeForm(forms.Form):
    code = forms.CharField()


class SignUpForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')

    def clean(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Користувач з таким емейлом існує")
        username = self.cleaned_data.get('username')
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError("Користувач з таким ніком існує")
        return self.cleaned_data
    
    def __init__(self, *args, **kwargs):
        super(SignUpForm, self).__init__(*args, **kwargs)

        self.fields['email'].widget.attrs['placeholder'] = '*Емейл'
        self.fields['username'].widget.attrs['placeholder'] = '*Нікнейм'
        self.fields['password1'].widget.attrs['placeholder'] = '*Пароль'
        self.fields['password2'].widget.attrs['placeholder'] = '*Підтвердження паролю'


class LoginForm(forms.ModelForm):
    email = forms.CharField(max_length=50, widget=forms.TextInput(attrs={"placeholder": "Емейл або нікнейм"}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={"placeholder": "Пароль"}))

    class Meta:
        model = User
        fields = ('email', 'password')
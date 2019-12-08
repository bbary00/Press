from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from django.contrib.auth import get_user_model
from .models import SummarizedText

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username',)


class UserRegisterSerializer(serializers.ModelSerializer):

    token = serializers.SerializerMethodField()
    password_confirmation = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('token',
                  'username',
                  'password',
                  'password_confirmation',
                  'email')
        extra_kwargs = {'password': {'write_only': True}}

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def validate_username(self, username):
        qs = User.objects.filter(username__iexact=username)
        if qs.exists():
            raise serializers.ValidationError("User with this username is already exists")
        return username

    def validate_password(self, password):
        if len(password) < 8:
            raise serializers.ValidationError('Password must have at least 8 chars!')
        if not any([letter.isupper() for letter in password]):
            raise serializers.ValidationError('Password must have at least one uppercase char!')
        if not any([letter.isdigit() for letter in password]):
            raise serializers.ValidationError('Password must have at least one digit!')
        return password

    def validate_email(self, email):
        qs = User.objects.filter(username__iexact=email)
        if qs.exists():
            raise serializers.ValidationError("User with this email is already exists")
        return email

    def validate(self, attrs):
        password = attrs.get('password')
        pw_confirm = attrs.get('password_confirmation')
        if password != pw_confirm:
            raise serializers.ValidationError('Passwords must match!')
        return attrs

    def create(self, validated_data):
        user_obj = User.objects.create(username=validated_data.get('username'),
                                       email=validated_data.get('email'))
        user_obj.set_password(validated_data.get('password'))
        user_obj.save()
        return user_obj


class TextSummarizationSerializer(serializers.ModelSerializer):

    class Meta:
        model = SummarizedText
        fields = '__all__'
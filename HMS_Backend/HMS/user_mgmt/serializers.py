from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from .models import CustomerUser, CustomerPasswordResetToken

# ---------------------------
# Registration Serializer
# ---------------------------
class CustomerUserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomerUser
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        # Use create_user to ensure password is hashed and logic applied
        user = CustomerUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

# ---------------------------
# JWT Login Serializer
# ---------------------------
class CustomerTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        # Authenticate using custom backend
        user = authenticate(
            request=self.context.get("request"),
            username=username,
            password=password
        )

        if not user:
            raise serializers.ValidationError({"detail": "Invalid username or password."})

        if not user.is_active:
            raise serializers.ValidationError({"detail": "This account is inactive."})

        self.user = user
        data = super().validate(attrs)

        # Add custom response fields
        data.update({
            "id": user.id,
            "username": user.username,
        })
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        return token

# ---------------------------
# Password Reset Request
# ---------------------------
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not CustomerUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email does not exist.")
        return value

    def create_reset_token(self):
        email = self.validated_data['email']
        user = CustomerUser.objects.get(email=email)
        token = get_random_string(64)

        reset_token = CustomerPasswordResetToken.objects.create(
            user=user,
            token=token
        )

        # Send email (simple example, adjust settings)
        send_mail(
            subject='Password Reset Request',
            message=f'Use this token to reset your password: {token}',
            from_email='no-reply@example.com',
            recipient_list=[user.email],
            fail_silently=False,
        )
        return reset_token

# ---------------------------
# Password Reset Confirm
# ---------------------------
class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        token = attrs.get('token')
        try:
            user = CustomerUser.objects.get(email=email)
        except CustomerUser.DoesNotExist:
            raise serializers.ValidationError({"email": "User not found."})

        try:
            reset_token = CustomerPasswordResetToken.objects.get(user=user, token=token, is_used=False)
        except CustomerPasswordResetToken.DoesNotExist:
            raise serializers.ValidationError({"token": "Invalid or used token."})

        attrs['user'] = user
        attrs['reset_token'] = reset_token
        return attrs

    def save(self):
        user = self.validated_data['user']
        reset_token = self.validated_data['reset_token']
        new_password = self.validated_data['new_password']

        # Set new password
        user.set_password(new_password)
        user.save()

        # Mark token as used
        reset_token.is_used = True
        reset_token.save()

        return user

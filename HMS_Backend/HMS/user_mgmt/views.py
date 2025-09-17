from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from datetime import timedelta


from .models import CustomerUser, CustomerPasswordResetToken
from .serializers import (
    CustomerUserRegisterSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    CustomerTokenObtainPairSerializer
)
from rest_framework_simplejwt.tokens import RefreshToken

# ---------------------------
# Registration View
# ---------------------------
class CustomerRegisterView(generics.CreateAPIView):
    queryset = CustomerUser.objects.all()
    serializer_class = CustomerUserRegisterSerializer
    permission_classes = [AllowAny]

# ---------------------------
# JWT Login View
# ---------------------------
class CustomerTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomerTokenObtainPairSerializer
    permission_classes = [AllowAny]

# ---------------------------
# Profile View
# ---------------------------
class CustomerProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_active": user.is_active,
            "is_staff": user.is_staff,
            "date_joined": user.date_joined
        })

# ---------------------------
# Password Reset Request
# ---------------------------
class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
  

        try:
            user = CustomerUser.objects.get(email=email)
        except CustomerUser.DoesNotExist:
            return Response({"detail": "Email not found"}, status=status.HTTP_404_NOT_FOUND)

        # Create token
        token = get_random_string(64)
        CustomerPasswordResetToken.objects.create(user=user, token=token)

        # Send email (adjust link as needed)
        reset_link = f"http://localhost:5173/password-reset-confirm?email={email}&token={token}"
        send_mail(
            "Password Reset Request",
            f"Click the link to reset your password: {reset_link}",
            "no-reply@example.com",
            [email],
            fail_silently=False
        )

        return Response({"detail": "Password reset link sent"}, status=status.HTTP_200_OK)

# ---------------------------
# Password Reset Confirm
# ---------------------------
class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        try:
            user = CustomerUser.objects.get(email=email)
            reset_token = CustomerPasswordResetToken.objects.get(user=user, token=token, is_used=False)
        except (CustomerUser.DoesNotExist, CustomerPasswordResetToken.DoesNotExist):
            return Response({"detail": "Invalid token or email"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if token expired (24h)
        if reset_token.created_at < timezone.now() - timedelta(hours=24):
            return Response({"detail": "Token expired"}, status=status.HTTP_400_BAD_REQUEST)

        # Set new password
        user.set_password(new_password)
        user.save()

        # Mark token as used
        reset_token.is_used = True
        reset_token.save()

        return Response({"detail": "Password reset successful"}, status=status.HTTP_200_OK)

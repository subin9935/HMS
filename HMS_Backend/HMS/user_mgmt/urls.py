from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomerRegisterView,  CustomerProfileView,
    PasswordResetRequestView, PasswordResetConfirmView ,CustomerTokenObtainPairView
)

urlpatterns = [
    path('register/', CustomerRegisterView.as_view(), name='customer_register'),
    path('profile/', CustomerProfileView.as_view(), name='customer_profile'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('token/', CustomerTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
]







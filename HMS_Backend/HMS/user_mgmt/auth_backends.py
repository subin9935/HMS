# customers/auth_backends.py
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model

CustomerUser = get_user_model()

class CustomerBackend(BaseBackend):
    """
    Custom authentication backend for CustomerUser using username and password.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = CustomerUser.objects.get(username=username)
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
        except CustomerUser.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            user = CustomerUser.objects.get(pk=user_id)
            if self.user_can_authenticate(user):
                return user
            return None
        except CustomerUser.DoesNotExist:
            return None

    def user_can_authenticate(self, user):
        """
        Reject users with is_active=False.
        """
        return getattr(user, "is_active", False)

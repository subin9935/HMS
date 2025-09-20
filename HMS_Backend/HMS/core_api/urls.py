from django.urls import path , include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import PatientViewSet,AppointmentViewSet,InsuranceViewSet,DoctorViewSet


urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('add-patients/', PatientViewSet.as_view({'post': 'create'}), name='add_patients'),
]




from django.urls import path , include
from .views import PatientViewSet,AppointmentViewSet,InsuranceViewSet,DoctorViewSet
from rest_framework.routers import DefaultRouter


# Create routers
router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'doctors', DoctorViewSet)
router.register(r'insurances', InsuranceViewSet)
router.register(r'appointments', AppointmentViewSet)


#Nested appoinments under patients

urlpatterns = [
    path('',include(router.urls))

]

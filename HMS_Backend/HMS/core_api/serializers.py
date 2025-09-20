from rest_framework import serializers
from .models import Patient, Doctor, Appointments, Insurance,PatientDocument


PAPERLESS_URL = "http://localhost:8001/api/documents/post_document/"
PAPERLESS_TOKEN = "0ed097627519b03e87b239e1d06a3cbd8a086a61"


class InsuranceSerializer(serializers.ModelSerializer):
    # Nested read-only insurance
    patient = serializers.PrimaryKeyRelatedField(read_only=True)  # ✅ Must have ()
    
    # Write-only field for assigning insurance via ID
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(),
        source='patient',  # links the patient.insurance field
        write_only=True,
        allow_null =True,
        required =False
        
    )

    class Meta:
        model = Insurance
        fields = ['id', 'plan_name', 'policy_number', 'insurance_provider','patient','patient_id']


class PatientDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientDocument
        fields = ["id", "paperless_id", "doc_type"]


class PatientSerializer(serializers.ModelSerializer):
    documents = PatientDocumentSerializer(many=True, write_only=True, required=False)
    # Insurances are read-only, not created instantly
    insurances = InsuranceSerializer(many=True, read_only=True)

    class Meta:
        model = Patient
        fields = [
            'id', 'first_name', 'last_name', 'date_of_birth', 'email', 'phone',
            'documents', 'insurances'
        ]

   # ------------------------------
# Doctor Serializer
# ------------------------------
class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'


# ------------------------------
# Appointment Serializer
# ------------------------------
class AppointmentSerializer(serializers.ModelSerializer):
    # Nested read-only patient & doctor
    patient = PatientSerializer(read_only=True)  # ✅ Must have ()
    doctor = DoctorSerializer(read_only=True)    # ✅ Must have ()

    # Write-only fields for linking via IDs
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(),
        source='patient',
        write_only=True
    )
    doctor_id = serializers.PrimaryKeyRelatedField(
        queryset=Doctor.objects.all(),
        source='doctor',
        write_only=True
    )

    class Meta:
        model = Appointments
        fields = [
            'id','patient','doctor','patient_id', 'doctor_id',
            'appointment_date', 'reason', 'status'
        ]
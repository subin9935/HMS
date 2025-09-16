from rest_framework import serializers
from .models import Patient, Doctor, Appointments, Insurance



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


class PatientSerializer(serializers.ModelSerializer):
    # Optional nested insurances for display or nested creation
    insurances = InsuranceSerializer(many=True, required=False)

    class Meta:
        model = Patient
        fields = ['id', 'first_name', 'last_name', 'date_of_birth', 'email', 'phone', 'insurances']

    def create(self, validated_data):
        insurances_data = validated_data.pop('insurances', [])
        patient = Patient.objects.create(**validated_data)
        for insurance_data in insurances_data:
            Insurance.objects.create(patient=patient, **insurance_data)
        return patient


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
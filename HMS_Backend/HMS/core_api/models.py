from django.db import models

# Create your models here.
class Patient(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
   

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

# Document model to link with Patient
class PatientDocument(models.Model):
    patient = models.ForeignKey(Patient, related_name="documents", on_delete=models.CASCADE)
    paperless_id = models.CharField(max_length=100)
    doc_type = models.CharField(max_length=50)  # e.g. "citizenship", "passport"

    def __str__(self):
        return f"{self.patient} - {self.doc_type} ({self.paperless_id})"
    

class Insurance(models.Model):
    plan_name = models.CharField(max_length=255)
    policy_number = models.CharField(max_length=100,unique=True)
    insurance_provider = models.CharField(max_length=255)
    patient = models.ForeignKey(Patient,on_delete=models.SET_NULL ,null=True ,blank =True,related_name='insurance')

    def __str__(self):
        return f"{self.name}-{self.policy_number}"



class Doctor(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    specilisation = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    

    def __str__(self):
        return f"{self.first_name}{self.last_name}"
    
class Appointments(models.Model):
    STATUS_CHOICES = [
        ('scheduled','Scheduled'),
        ('completed','Completed'),
        ('cancelled','Cancelled')
    ]    

    patient = models.ForeignKey(Patient,on_delete=models.CASCADE,related_name='appointment')
    doctor = models.ForeignKey(Doctor,on_delete=models.CASCADE,related_name='appointment')
    appointment_date = models.DateTimeField()
    reason = models.TextField(blank=True,null=True)
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default='scheduled')

    def __str__(self):
        return f"Appointment : {self.patient} with {self.doctor} on {self.appointment_date}"
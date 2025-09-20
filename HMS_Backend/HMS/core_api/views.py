from rest_framework import viewsets
from .models import Patient,Doctor,Appointments,Insurance,PatientDocument
from .serializers import PatientSerializer,InsuranceSerializer,DoctorSerializer,AppointmentSerializer,PatientSerializer
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework import viewsets, status, permissions
from django.db import transaction
import requests
import logging

logger = logging.getLogger(__name__)



# Create your views here.
class InsuranceViewSet(viewsets.ModelViewSet):
    queryset = Insurance.objects.all()
    serializer_class = InsuranceSerializer

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointments.objects.all()
    serializer_class = AppointmentSerializer


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        PAPERLESS_TOKEN = "0ed097627519b03e87b239e1d06a3cbd8a086a61"
        headers = {"Authorization": f"Token {PAPERLESS_TOKEN}"}
        PAPERLESS_URL = "http://localhost:8001/api/documents/post_document/"
        TAGS_URL = "http://localhost:8001/api/tags/"

        def get_or_create_tag(tag_name):
            """Get or create a tag in Paperless, return its ID."""
            try:
                response = requests.get(
                    TAGS_URL,
                    headers=headers,
                    params={"name__iexact": tag_name},
                )
                if response.status_code == 200 and response.json().get("results"):
                    return response.json()["results"][0]["id"]

                response = requests.post(
                    TAGS_URL,
                    headers=headers,
                    json={"name": tag_name},
                )
                if response.status_code == 201:
                    return response.json()["id"]

                logger.error(f"Failed to create tag {tag_name}: {response.status_code} {response.text}")
                return None
            except Exception as e:
                logger.exception(f"Error fetching/creating tag {tag_name}: {e}")
                return None

        def upload_to_paperless(file_obj, patient_id, doc_type):
            """Upload file to Paperless, return its document ID."""
            patient_tag = get_or_create_tag(f"patient_{patient_id}")
            doc_type_tag = get_or_create_tag(doc_type)

            if not patient_tag or not doc_type_tag:
                logger.error(f"Could not resolve tags for patient_{patient_id} or {doc_type}")
                return None

            files = {"document": file_obj}
            data = {
                "title": f"{doc_type} of patient {patient_id}",
                "tags": [patient_tag, doc_type_tag],
            }
            try:
                r = requests.post(PAPERLESS_URL, headers=headers, files=files, data=data)
                if r.status_code in (200, 201):
                    try:
                        # Try parsing JSON
                        return r.json().get("id")
                    except (ValueError, AttributeError):
                        # If it's plain text (string ID)
                        return r.text.strip()
                else:
                    logger.error(f"Paperless upload failed: {r.status_code} {r.text}")
            except Exception as e:
                logger.exception(f"Exception uploading to Paperless: {e}")
            return None

        uploaded_documents = []
        patient_data = {
            "first_name": request.data.get("first_name"),
            "last_name": request.data.get("last_name"),
            "date_of_birth": request.data.get("date_of_birth"),
            "email": request.data.get("email"),
            "phone": request.data.get("phone"),
        }

        try:
            with transaction.atomic():
                patient = Patient.objects.create(**patient_data)

                # Upload all documents
                for doc_key in request.FILES:
                    for file in request.FILES.getlist(doc_key):
                        paperless_id = upload_to_paperless(file, patient.id, doc_key)
                        if paperless_id:
                            PatientDocument.objects.create(
                                patient=patient,
                                paperless_id=paperless_id,
                                doc_type=doc_key,
                            )
                            uploaded_documents.append({
                                "doc_type": doc_key,
                                "paperless_id": paperless_id,
                                "filename": file.name,
                            })
        except Exception as e:
            logger.exception(f"Error creating patient or uploading documents: {e}")
            return Response(
                {"detail": "Failed to create patient or upload documents."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        serializer = self.get_serializer(patient)
        data = serializer.data
        data["uploaded_documents"] = uploaded_documents
        return Response(data, status=status.HTTP_201_CREATED)

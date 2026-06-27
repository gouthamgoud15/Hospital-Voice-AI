from pydantic import BaseModel


class AppointmentCreate(BaseModel):
    patient_name: str
    doctor_id: int
    date: str
    time: str


class DoctorSlotsRequest(BaseModel):
    doctor_id: int


class DoctorRequest(BaseModel):
    doctor_name: str


class CancelAppointment(BaseModel):
    appointment_id: int


class RescheduleAppointment(BaseModel):
    appointment_id: int
    new_date: str
    new_time: str
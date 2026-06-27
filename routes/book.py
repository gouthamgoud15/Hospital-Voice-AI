from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Appointment
from schemas import AppointmentCreate


router = APIRouter()


@router.post("/book")

def book_appointment(
        appointment: AppointmentCreate,
        db: Session = Depends(get_db)
):

    new_appointment = Appointment(

        patient_name=appointment.patient_name,

        doctor_id=appointment.doctor_id,

        date=appointment.date,

        time=appointment.time,

        status="Booked"
    )

    db.add(new_appointment)

    db.commit()

    db.refresh(new_appointment)

    return {

        "message": "Appointment Booked",

        "appointment_id": new_appointment.id,

        "status": "Booked"
    }
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from datetime import date
from fastapi.middleware.cors import CORSMiddleware

from database import engine, get_db
from models import Base, Appointment, Doctor
from schemas import (
    AppointmentCreate,
    DoctorSlotsRequest,
    DoctorRequest,
    CancelAppointment,
    RescheduleAppointment
)
app = FastAPI(
    title="Hospital Voice AI",
    description="AI Powered Hospital Voice Receptionist",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ubiquitous-gecko-38225b.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Create Database Tables
Base.metadata.create_all(bind=engine)

from database import SessionLocal

db = SessionLocal()

if db.query(Doctor).count() == 0:

    doctors = [

        Doctor(
            name="Dr Priya Sharma",
            department="Cardiology",
            experience=12,
            consultation_type="In Person",
            available_days="Mon,Tue,Fri"
        ),

        Doctor(
            name="Dr Rajesh Kumar",
            department="Dermatology",
            experience=15,
            consultation_type="Online",
            available_days="Mon,Wed,Sat"
        ),

        Doctor(
            name="Dr Ananya Rao",
            department="Neurology",
            experience=10,
            consultation_type="In Person",
            available_days="Tue,Thu"
        )

    ]

    db.add_all(doctors)
    db.commit()

db.close()
# ---------------------------------
# Home
# ---------------------------------

@app.get("/")
def home():
    return {
        "message": "Hospital Voice AI Running Successfully"
    }


# ---------------------------------
# Book Appointment
# ---------------------------------

@app.post("/book")
def book_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db)
):
    try:
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
            "message": "Appointment Booked Successfully",
            "appointment_id": new_appointment.id,
            "patient_name": new_appointment.patient_name,
            "doctor_id": new_appointment.doctor_id,
            "date": new_appointment.date,
            "time": new_appointment.time,
            "status": new_appointment.status
        }

    except Exception as e:
        db.rollback()
        import traceback
        traceback.print_exc()
        return {"error": str(e)}


# ---------------------------------
# Get Doctors
# ---------------------------------

@app.get("/doctors")
def get_doctors(
    db: Session = Depends(get_db)
):

    doctors = db.query(Doctor).all()

    return doctors


# ---------------------------------
# Available Slots
# ---------------------------------
@app.post("/available-slots")
def available_slots(request: DoctorSlotsRequest):

    slots = {
        1: [
            "10:00 AM",
            "11:00 AM",
            "03:00 PM"
        ],
        2: [
            "09:00 AM",
            "01:00 PM",
            "04:00 PM"
        ],
        3: [
            "10:30 AM",
            "12:00 PM",
            "05:00 PM"
        ]
    }

    return {
        "doctor_id": request.doctor_id,
        "available_slots": slots.get(request.doctor_id, [])
    }
# ---------------------------------
# Cancel Appointment
# ---------------------------------

@app.post("/cancel/{appointment_id}")
def cancel_appointment(
    appointment_id: int,
    db: Session = Depends(get_db)
):

    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id
    ).first()

    if appointment is None:

        return {
            "message": "Appointment Not Found"
        }

    appointment.status = "Cancelled"

    db.commit()

    return {
        "message": "Appointment Cancelled Successfully",
        "appointment_id": appointment.id,
        "status": appointment.status
    }




# ----------------------------------------
# Reschedule Appointment
# ----------------------------------------

@app.put("/reschedule")
def reschedule_appointment(
    request: RescheduleAppointment,
    db: Session = Depends(get_db)
):
    appointment = db.query(Appointment).filter(
        Appointment.id == request.appointment_id
    ).first()

    if appointment is None:
        return {
            "message": "Appointment Not Found"
        }

    appointment.date = request.new_date
    appointment.time = request.new_time
    appointment.status = "Rescheduled"

    db.commit()
    db.refresh(appointment)

    return {
        "message": "Appointment Rescheduled Successfully",
        "appointment_id": appointment.id,
        "patient_name": appointment.patient_name,
        "doctor_id": appointment.doctor_id,
        "new_date": appointment.date,
        "new_time": appointment.time,
        "status": appointment.status
    }
 # ----------------------------------------
# View All Appointments (For Testing)
# ----------------------------------------

@app.get("/appointments")
def get_appointments(db: Session = Depends(get_db)):
    appointments = db.query(Appointment).all()

    return [
        {
            "id": appointment.id,
            "patient_name": appointment.patient_name,
            "doctor_id": appointment.doctor_id,
            "date": appointment.date,
            "time": appointment.time,
            "status": appointment.status
        }
        for appointment in appointments
    ]
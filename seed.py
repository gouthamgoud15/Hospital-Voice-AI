from database import SessionLocal
from models import Doctor


db = SessionLocal()


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


for doctor in doctors:

    db.add(doctor)


db.commit()

print("Doctors Added Successfully")
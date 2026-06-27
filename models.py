from sqlalchemy import Column, Integer, String, Date, ForeignKey

from database import Base


class Doctor(Base):

    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String)

    department = Column(String)

    experience = Column(Integer)

    consultation_type = Column(String)

    available_days = Column(String)



class Appointment(Base):

    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)

    patient_name = Column(String)

    doctor_id = Column(Integer, ForeignKey("doctors.id"))

    date = Column(String)

    time = Column(String)


    status = Column(String, default="Booked")
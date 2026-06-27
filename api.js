// ===========================================
// Hospital Voice AI API
// ===========================================

// Change this if using ngrok
const BASE_URL = "https://hospital-voice-ai.onrender.com";
// ===========================================
// Load Doctors
// ===========================================

async function loadDoctors(){

    try{

        const response = await fetch(BASE_URL + "/doctors");

        const doctors = await response.json();

        const doctorGrid = document.getElementById("doctorGrid");

        const doctorSelect = document.getElementById("doctorSelect");

        doctorGrid.innerHTML = "";

        doctorSelect.innerHTML =
        `<option value="">Select Doctor</option>`;

        doctors.forEach(doctor=>{

            doctorGrid.innerHTML += `

            <div class="doctor-card">

                <div class="doctor-image">

                    <i class="fa-solid fa-user-doctor"></i>

                </div>

                <h3>${doctor.name}</h3>

                <span class="specialization">

                    ${doctor.specialization}

                </span>

                <p>

                    Experience : ${doctor.experience} Years

                </p>

                <button onclick="getSlots(${doctor.id})">

                    View Available Slots

                </button>

            </div>

            `;

            doctorSelect.innerHTML += `

                <option value="${doctor.id}">

                    ${doctor.name}

                </option>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

}
// ===========================================
// Available Slots
// ===========================================

async function getSlots(doctorId){

    try{

        const response = await fetch(

            BASE_URL + "/available-slots",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    doctor_id:doctorId

                })

            }

        );

        const data = await response.json();

        const slotSelect =
        document.getElementById("slotSelect");

        slotSelect.innerHTML="";

        data.available_slots.forEach(slot=>{

            slotSelect.innerHTML +=

            `<option>${slot}</option>`;

        });

    }

    catch(error){

        console.log(error);

    }

}
// ===========================================
// Book Appointment
// ===========================================

async function bookAppointment(){

    const patientName =
    document.getElementById("patientName").value;

    const doctorId =
    document.getElementById("doctorSelect").value;

    const date =
    document.getElementById("appointmentDate").value;

    const time =
    document.getElementById("slotSelect").value;

    if(patientName==="" ||
       doctorId==="" ||
       date==="" ||
       time===""){

        alert("Please fill all fields.");

        return;

    }

    try{

        const response = await fetch(

            BASE_URL + "/book",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    patient_name:patientName,

                    doctor_id:Number(doctorId),

                    date:date,

                    time:time

                })

            }

        );

        const result =
        await response.json();

        alert(result.message);

        loadAppointments();

        loadDashboard();

    }

    catch(error){

        console.log(error);

    }

}
// ===========================================
// Load Appointments
// ===========================================

async function loadAppointments(){

    try{

        const response = await fetch(BASE_URL + "/appointments");

        const appointments = await response.json();

        const table = document.getElementById("appointmentTable");

        table.innerHTML = "";

        appointments.forEach(appointment=>{

            let badge = "";

            if(appointment.status==="Booked")
                badge='<span class="status-booked">Booked</span>';

            else if(appointment.status==="Cancelled")
                badge='<span class="status-cancelled">Cancelled</span>';

            else if(appointment.status==="Rescheduled")
                badge='<span class="status-rescheduled">Rescheduled</span>';

            else
                badge=appointment.status;

            table.innerHTML += `

            <tr>

                <td>${appointment.id}</td>

                <td>${appointment.patient_name}</td>

                <td>${appointment.doctor_id}</td>

                <td>${appointment.date}</td>

                <td>${appointment.time}</td>

                <td>${badge}</td>

                <td>

                    <button class="action-btn reschedule-btn"
                        onclick="rescheduleAppointment(${appointment.id})">

                        Reschedule

                    </button>

                    <button class="action-btn cancel-btn"
                        onclick="cancelAppointment(${appointment.id})">

                        Cancel

                    </button>

                </td>

            </tr>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

}
// ===========================================
// Cancel Appointment
// ===========================================

async function cancelAppointment(id){

    if(!confirm("Do you want to cancel this appointment?"))
        return;

    try{

        const response = await fetch(

            BASE_URL + "/cancel",

            {

                method:"DELETE",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    appointment_id:id

                })

            }

        );

        const result = await response.json();

        alert(result.message);

        loadAppointments();

        loadDashboard();

    }

    catch(error){

        console.log(error);

    }

}
// ===========================================
// Reschedule Appointment
// ===========================================

async function rescheduleAppointment(id){

    const newDate = prompt("Enter New Date (YYYY-MM-DD)");

    if(newDate==null || newDate=="")
        return;

    const newTime = prompt("Enter New Time (Example: 10:00 AM)");

    if(newTime==null || newTime=="")
        return;

    try{

        const response = await fetch(

            BASE_URL + "/reschedule",

            {

                method:"PUT",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    appointment_id:id,

                    new_date:newDate,

                    new_time:newTime

                })

            }

        );

        const result = await response.json();

        alert(result.message);

        loadAppointments();

    }

    catch(error){

        console.log(error);

    }

}
// ===========================================
// Auto Refresh
// ===========================================

setInterval(()=>{

    loadDashboard();

},5000);
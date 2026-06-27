// ===============================================
// Hospital Voice AI
// script.js
// ===============================================

// Current Page
let currentSection = "dashboard";

console.log("Script Loaded");
console.log("Vapi:", window.Vapi);
// ===============================================
// Sidebar Navigation
// ===============================================

function showSection(sectionId) {

    document.querySelectorAll(".page").forEach(page => {

        page.classList.remove("active-page");

    });

    document.getElementById(sectionId).classList.add("active-page");

    document.querySelectorAll(".menu li").forEach(item => {

        item.classList.remove("active");

    });

    event.currentTarget.classList.add("active");

    currentSection = sectionId;

    if(sectionId==="doctors")
        loadDoctors();

    if(sectionId==="appointments")
        loadAppointments();

}

// ===============================================
// Page Load
// ===============================================

window.onload = () => {

    loadDashboard();

    loadDoctors();

    loadAppointments();

};

// ===============================================
// Search Doctors
// ===============================================

function searchDoctors(){

    let input = document
    .getElementById("doctorSearch")
    .value.toLowerCase();

    let cards = document.querySelectorAll(".doctor-card");

    cards.forEach(card=>{

        let text = card.innerText.toLowerCase();

        if(text.includes(input))

            card.style.display="block";

        else

            card.style.display="none";

    });

}

// ===============================================
// Search Appointment
// ===============================================

function searchAppointments(){

    let input = document
    .getElementById("appointmentSearch")
    .value.toLowerCase();

    let rows = document.querySelectorAll("#appointmentTable tr");

    rows.forEach(row=>{

        if(row.innerText.toLowerCase().includes(input))

            row.style.display="";

        else

            row.style.display="none";

    });

}
// ===============================================
// Dashboard
// ===============================================

async function loadDashboard(){

    try{

        const doctorResponse =
        await fetch(BASE_URL+"/doctors");

        const doctors =
        await doctorResponse.json();

        document.getElementById("doctorCount")
        .innerHTML = doctors.length;

        const appointmentResponse =
        await fetch(BASE_URL+"/appointments");

        const appointments =
        await appointmentResponse.json();

        document.getElementById("appointmentCount")
        .innerHTML = appointments.length;

    }

    catch(error){

        console.log(error);

    }

}


// ==============================
// Start Talking Button
// ==============================

document.addEventListener("DOMContentLoaded", () => {

    const voiceButton = document.getElementById("voiceButton");

    if (voiceButton) {

        voiceButton.addEventListener("click", () => {

            window.open(
                "https://vapi.ai?demo=true&shareKey=e0ecf6fd-8875-4d3c-a59a-9f32b97806d9&assistantId=aa7cd627-ed54-43c7-99ff-4ac6e62a7c13",
                "_blank"
            );

        });

    }

    loadDoctors();
    loadAppointments();
    loadDashboard();

});

"use strict";

function findGroupMeetings() {
    const groupUUID = sessionStorage.getItem("userGroupUUID");

    if (!groupUUID) {
        console.error("No se encontró un Group UUID en sessionStorage.");
        return;
    }
    console.log("Group UUID obtenido del sessionStorage:", groupUUID);

    fetch('/meetings')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(meetings => {
            console.log("Reuniones obtenidas de la API:", meetings);
            
            if (!Array.isArray(meetings)) {
                console.error("La respuesta no es un array:", meetings);
                return;
            }

            const groupMeetings = meetings.filter(meeting => meeting._groupUUID === groupUUID);

            if (groupMeetings.length > 0) {
                sessionStorage.setItem("groupMeetings", JSON.stringify(groupMeetings));
                console.log("Reuniones del grupo guardadas en sessionStorage:", groupMeetings);
                renderMeetingsOnCalendar();
            } else {
                console.log("No se encontraron reuniones para este grupo.");
                sessionStorage.removeItem("groupMeetings");
            }
        })
        .catch(error => {
            console.error("Error al obtener las reuniones:", error);
        });
}

function renderMeetingsOnCalendar() {
    const meetingsStr = sessionStorage.getItem("groupMeetings");
    console.log("Reuniones en sessionStorage:", meetingsStr);

    if (!meetingsStr) {
        console.log("No hay reuniones disponibles para renderizar.");
        return;
    }

    const meetings = JSON.parse(meetingsStr);
    const monthFilter = document.getElementById("monthFilter");
    
    if (!monthFilter) {
        console.error("No se encontró el elemento monthFilter");
        return;
    }

    const selectedMonth = monthFilter.value;

    // Primero, limpiar todos los contenedores de reuniones
    document.querySelectorAll('.day-content').forEach(container => {
        container.innerHTML = '';
    });

    // Ordenar las reuniones por hora antes de renderizarlas
    meetings.sort((a, b) => {
        const timeA = new Date(`1970/01/01 ${a._time}`);
        const timeB = new Date(`1970/01/01 ${b._time}`);
        return timeA - timeB;
    });

    meetings.forEach(meeting => {
        console.log("Procesando reunión:", meeting);

        const meetingDate = new Date(meeting._date);
        const meetingMonth = meetingDate.getMonth() + 1;
        const meetingDay = meetingDate.getDate();

        if (Number(selectedMonth) === meetingMonth) {
            const dayDiv = document.getElementById(`day-${meetingDay}`);

            if (dayDiv) {
                console.log(`Añadiendo contenido a día ${meetingDay}:`, {
                    propósito: meeting._purpose,
                    descripción: meeting._description,
                    ubicación: meeting._location,
                    hora: meeting._time
                });

                const meetingElement = document.createElement('div');
                meetingElement.className = 'meeting-item';
                meetingElement.innerHTML = `
                    <div class="meeting-content">
                        <hr>
                        <p><strong>${meeting._purpose}</strong></p>
                        <p>${meeting._location}</p>
                        <p><strong>Hora:</strong> ${meeting._time}</p>
                        <hr>
                    </div>
                `;

                const dayContent = dayDiv.querySelector(".day-content");
                if (dayContent) {
                    dayContent.appendChild(meetingElement);
                } else {
                    console.warn(`No se encontró el elemento .day-content para el día ${meetingDay}`);
                }
            } else {
                console.warn(`No se encontró el div para el día ${meetingDay}`);
            }
        }
    });
}

function createMeeting(data) {
    const url = '/meetings';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Meeting created:', data);
        findGroupMeetings();
        if (typeof toGroups === 'function') {
            toGroups();
        }
    })
    .catch(error => {
        console.error(`Error creating meeting at ${url}:`, error);
    });
}

if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        findGroupMeetings();
        
        const monthFilter = document.getElementById("monthFilter");
        if (monthFilter) {
            monthFilter.addEventListener("change", renderMeetingsOnCalendar);
        }
    });
}
"use strict";

function toCalendar() {
    if (sessionStorage.getItem('userUUID')) {
        window.location.href = '/calendarh';
    } else {
        window.location.href = '/';
    }
}

function toDashboard() {
    if (sessionStorage.getItem('userUUID')) {
        window.location.href = '/dashboardh';
    } else {
        window.location.href = '/';
    }
}

function toGroups() {
    if (sessionStorage.getItem('userUUID')) {
        window.location.href = '/groupsh';
    } else {
        window.location.href = '/';
    }
}

function toUsers() {
    if (sessionStorage.getItem('userUUID')) {
        window.location.href = '/usersh';
    } else {
        window.location.href = '/';
    }
}

function toConfiguration() {
    if (sessionStorage.getItem('userUUID')) {
        window.location.href = '/settingsh';
    } else {
        window.location.href = '/';
    }
}

function logout() {
    sessionStorage.removeItem('userUUID');
    window.location.href = '/';
}

function loadMainUser() {
    var userUUID = sessionStorage.getItem('userUUID');
    let currentUserDiv = document.getElementById('userprofile');
    if (userUUID && currentUserDiv) {
        const url = `/users/${userUUID}`;
        fetch(url, {
            method: 'GET'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                currentUserDiv.innerHTML = 
                `
                    <img src="${data._urlImage}" alt="${data._firstName}" class="avatar">
                    <div>
                        <div class="user-name">${data._firstName} ${data._lastName}</div>
                        <div class="user-uuid">${data._UUID}</div>
                        <div class="notification-icons">
                            <span>🔔</span>
                            <span>✉️</span>
                        </div>
                    </div>
                `;
            })
            .catch(error => {
                console.error(`Error fetching user from ${url}:`, error);
            });
    } else {
        console.error('Element with id "userprofile" not found or userUUID is null');
    }
}
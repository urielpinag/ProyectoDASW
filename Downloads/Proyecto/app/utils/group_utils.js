"use strict";

function createGroup(data) {
  const url = '/groups';
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
          console.log('Group created:', data);
          toGroups();
      })
      .catch(error => {
          console.error(`Error creating group at ${url}:`, error);
      });
}

function findUserGroup() {
    // Obtener el UUID del usuario desde sessionStorage
    const userUUID = sessionStorage.getItem("userUUID");
    // Realizar una solicitud a la API para obtener los grupos
    fetch('/groups')  // Asegúrate de que esta ruta te devuelva todos los grupos
        .then(response => response.json())
        .then(groups => {
            // Iterar sobre los grupos para encontrar el que contiene al usuario
            groups.forEach(group => {
                console.log("Comprobando grupo:", group._name);
            console.log("Usuarios en el grupo:", group._users);
                if (group._users.includes(userUUID)) {
                    // Si el UUID del usuario está en el grupo, guardar el UUID del grupo
                    sessionStorage.setItem("userGroupUUID", group._UUID);
                    console.log("El usuario pertenece al grupo:", group._name);
                }
            });
        })
        .catch(error => {
            console.error("Error al obtener los grupos:", error);
        });


// Llamar a la función para buscar el grupo del usuario cuando se cargue la página
if (typeof window !== 'undefined') {
    window.onload = function() {
        findUserGroup();
    };
}}


// Cargar Grupos al HTMLdocument.addEventListener("DOMContentLoaded", function () {
    // Contenedor donde se generarán los grupos
    const groupsContainer = document.getElementById("groups-container");

    // Función para obtener grupos desde la API
    function fetchGroups() {
        fetch("http://localhost:3000/groups")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la respuesta de la API");
                }
                return response.json();
            })
            .then(groups => {
                // Limpia el contenedor antes de renderizar
                groupsContainer.innerHTML = "";

                // Genera el HTML para cada grupo
                groups.forEach(group => {
                    const groupBox = document.createElement("div");
                    groupBox.classList.add("group-item");

                    // Inserta los datos dinámicamente
                    groupBox.innerHTML = `
                    <div class="group-card">
                    <div class="group-info">
                        <div class="group-icon">
                            <img src="${group._urlImage || 'default-group-avatar.jpg'}" alt="${group._name}" class="avatar">
                        </div>
                        <div class="group-details">
                            <h3>${group._name}</h3>
                            <p>${group._members ? group._members.length : 0} members</p>
                        </div>
                    </div>
                    </div>
                `;

                    // Añade la tarjeta de grupo al contenedor
                    groupsContainer.appendChild(groupBox);
                });

                // Agrega funcionalidad a los botones de edición
                document.querySelectorAll(".edit-group-btn").forEach(button => {
                    button.addEventListener("click", function () {
                        const groupUUID = this.getAttribute("data-uuid");
                        console.log("Editar grupo con UUID:", groupUUID);
                        // Aquí puedes redirigir a una página de edición o mostrar un modal
                    });
                });
            })
            .catch(error => {
                console.error("Error al obtener grupos:", error);
                groupsContainer.innerHTML = "<p>Error al cargar grupos.</p>";
            });
    }

    // Iniciar la carga de grupos
    fetchGroups();


function loadGroupsIntoSelect() {
    // Hacer la petición a /groups
    fetch('/groups')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(groups => {
            const select = document.getElementById('meetingGroupSelect');
            const hiddenInput = document.getElementById('meetingGroupUUID');

            // Limpiar opciones existentes excepto la primera
            while (select.options.length > 1) {
                select.remove(1);
            }

            // Ordenar grupos alfabéticamente por nombre
            groups.sort((a, b) => {
                const nameA = a._name.toUpperCase();
                const nameB = b._name.toUpperCase();
                return nameA.localeCompare(nameB);
            });

            // Agregar cada grupo como una opción
            groups.forEach(group => {
                const option = document.createElement('option');
                option.value = group._groupUUID;
                option.textContent = group._name;
                select.appendChild(option);
            });

            // Evento para actualizar el input oculto cuando cambia la selección
            select.addEventListener('change', (event) => {
                hiddenInput.value = event.target.value;
            });

            // Si había un UUID previamente seleccionado, intentar seleccionarlo
            const previousUUID = hiddenInput.value;
            if (previousUUID) {
                const option = select.querySelector(`option[value="${previousUUID}"]`);
                if (option) {
                    option.selected = true;
                }
            }
        })
        .catch(error => {
            console.error('Error cargando grupos:', error);
            // Mostrar mensaje de error en el select
            const select = document.getElementById('meetingGroupSelect');
            select.innerHTML = '<option value="">Error cargando grupos</option>';
        });
}

document.addEventListener("DOMContentLoaded", fetchAndRenderGroups);

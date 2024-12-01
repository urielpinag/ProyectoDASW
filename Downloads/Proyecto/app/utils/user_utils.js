"use strict";

//funcion para cargar el usurio de la cuenta abierta
function mainUserToHTML() {
    getUserByUUID(sessionStorage.getItem(userUUID)).then(user => {
        // Add your code here to handle the user object
    });
}

//funcion para cargar los usuarios de los grupos
function usersToHTML(users) {
    
}
document.addEventListener("DOMContentLoaded", function () {
    // Contenedor donde se generarán los usuarios
    const usersContainer = document.getElementById("users-container");

    // Función para obtener usuarios desde la API
    function fetchUsers() {
        fetch("http://localhost:3000/users")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la respuesta de la API");
                }
                return response.json();
            })
            .then(users => {
                // Limpia el contenedor antes de renderizar
                usersContainer.innerHTML = "";

                // Genera el HTML para cada usuario
                users.forEach(user => {
                    const userBox = document.createElement("div");
                    userBox.classList.add("user-item");

                    // Inserta los datos dinámicamente
                    userBox.innerHTML = `
                        <img src="${user._urlImage || 'default-avatar.jpg'}" alt="${user._firstName} ${user._lastName}" class="avatar">
                        <div class="user-info">
                            <h3>${user._firstName} ${user._lastName}</h3>
                            <p>${user._email}</p>
                        </div>
                    `;

                    // Añade la cajita al contenedor
                    usersContainer.appendChild(userBox);
                });

                // Agrega funcionalidad a los botones de edición
                document.querySelectorAll(".edit-btn").forEach(button => {
                    button.addEventListener("click", function () {
                        const userUUID = this.getAttribute("data-uuid");
                        console.log("Editar usuario con UUID:", userUUID);
                        // Aquí puedes redirigir a una página de edición o mostrar un modal
                    });
                });
            })
            .catch(error => {
                console.error("Error al obtener usuarios:", error);
                usersContainer.innerHTML = "<p>Error al cargar usuarios.</p>";
            });
    }



    // Iniciar la carga de usuarios
    fetchUsers();
});

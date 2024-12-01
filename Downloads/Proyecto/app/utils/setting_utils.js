"use strict";

function updateUser(user) {
  let userUUID = sessionStorage.getItem("userUUID");
  let cuser;
  fetch(`http://localhost:3000/users/${userUUID}`, {
    method: 'get'
  })
    .then(response => response.json())
    .then(data => {
      cuser = data;
      user._firstName = user._firstName || cuser._firstName;
      user._lastName = user._lastName || cuser._lastName;
      user._email = user._email || cuser._email;
      user._password = user._password || cuser._password;
      user._urlImage = user._urlImage || cuser._urlImage;
      user._groupUUID = user._groupUUID || cuser._groupUUID;
      user._group = user._group || cuser._group;
      if (!user._firstName || !user._lastName || !user._email || !user._password) {
        throw new Error('Datos del usuario incompletos o inválidos');
      }
      fetch(`http://localhost:3000/users/${userUUID}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
      })
      .then(data => {
        console.log('Usuario actualizado:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
"use strict";

function login(req, res) {
  let email = req.body.email;
  let password = req.body.password;

  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      sessionStorage.setItem("userUUID", data.userUUID);
      window.location.href = '/dashboardh';
    } else {
      alert("Invalid email or password");
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert("Invalid email or password");
  });
}

function register(req, res) {
  let _firstName = req.body.firstName;
  let _lastName = req.body.lastName;
  let _email = req.body.email;
  let _password = req.body.password;
  let _urlImage = "";
  let _groupUUID = "";
  let _group = "";

  fetch('/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ _firstName, _lastName, _email, _password, _urlImage, _groupUUID, _group })
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => { throw err; });
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      alert("Account created successfully");
    } else {
      alert("Error creating account: " + data.error);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert("Error creating account: " + error.message);
  });
}

if (typeof window !== 'undefined') {
    window.login = login;
    window.register = register;
}
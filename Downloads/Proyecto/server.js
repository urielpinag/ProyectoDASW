"use strict";

const express = require("express");
const mongoose = require("mongoose");
const path = require("path"); 
const router = require('./app/controllers/router');
const { getUserByEmail } = require('./app/data/users');
const bcrypt = require('bcryptjs');
const app = express();
const port = 3000;

let mongoDBURL = '';

mongoose.connect(mongoDBURL).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('Error connecting to MongoDB');
    console.log(error);
});

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app')));

app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
    }
    next();
});

app.use(router);

app.post('/api/login', async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  try {
    let user = await getUserByEmail(email);
    if (user && bcrypt.compareSync(password, user._password)) {
      res.json({ success: true, userUUID: user._UUID });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    res.json({ success: false });
  }
});

app.get('/dashboardh', (_req, res) => {
    res.sendFile(path.join(__dirname, 'app/views/dashboard.html'));
});

app.get('/calendarh', (_req, res) => {
    res.sendFile(path.join(__dirname, 'app/views/calendar.html'));
});

app.get('/groupsh', (_req, res) => {
    res.sendFile(path.join(__dirname, 'app/views/groups.html'));
});

app.get('/usersh', (_req, res) => {
    res.sendFile(path.join(__dirname, 'app/views/users.html'));
});

app.get('/settingsh', (_req, res) => {
    res.sendFile(path.join(__dirname, 'app/views/settings.html'));
});

app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'app/views/HOME.html')); 
});

app.listen(port, () => {
    console.log(`Proyecto app listening at http://localhost:${port}`);
});
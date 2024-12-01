"use strict";

const express = require("express");
const router = express.Router();
const groupRouter = require("../routes/groups");
const userRouter = require("../routes/users");
const meetingsRouter = require("../routes/meetings");

const { login } = require('../utils/login_util');

router.use("/groups", groupRouter);
router.use("/users", userRouter);
router.use("/meetings", meetingsRouter);

router.route("/")
    .post((req, res) => { login(req, res) }
);

module.exports = router;
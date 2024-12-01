"use strict";

const express = require("express");
const router = express.Router();
const { getUsers, getUserByUUID, createUser, updateUser, deleteUser } = require("../data/users");

router.route("/")
    .get(async (req, res) => {
        let query = req.query.filter;
        let users;
        try {
            users = await getUsers();
            if (query) {
                users = users.filter(user => {
                    return user.firstName.includes(query) || user.email.includes(query);
                });
            }
            res.status(200).json(users);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

router.route("/:id")
    .get(async (req, res) => {
        let id = req.params.id; // Cambiado de req.body._UUID a req.params.id
        let user;
        try {
            user = await getUserByUUID(id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    });

router.route('/')
    .post(async (req, res) => {
        let user = req.body;
        try {
            await createUser(user);
            res.status(201).json({ success: true, message: `User ${user._firstName} was created` });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    });

router.route('/:id')
    .put(async (req, res) => {
        let id = req.params.id;
        let user = req.body;
        try {
            await updateUser(id, user);
            res.status(200).send(`User ${user._firstName} was updated`);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    })
    .delete(async (req, res) => {
        let id = req.params.id;
        try {
            await deleteUser(id);
            res.status(200).send(`User ${id} was deleted`);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

module.exports = router;
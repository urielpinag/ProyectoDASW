"use strict";

const express = require("express");
const router = express.Router();
const { getMeetings, getMeetingByUUID, createMeeting, updateMeeting, deleteMeeting } = require("../data/meetings");

router.route("/")
    .get(async (req, res) => {
        let query = req.query.filter;
        let meetings;
        try {
            meetings = await getMeetings();
            if (query) {
                meetings = meetings.filter(meeting => {
                    return meeting.name.includes(query) || meeting.description.includes(query);
                });
            }
            res.status(200).json(meetings);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

router.route("/:id")
    .get(async (req, res) => {
        let id = req.params.id;
        let meeting;
        try {
            meeting = await getMeetingByUUID(id);
            res.status(200).json(meeting);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    });

router.route('/')
    .post(async (req, res) => {
        let meeting = req.body;
        try {
            await createMeeting(meeting);
            res.status(201).send(`Meeting ${meeting.name} was created`);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

router.route('/:id')
    .put(async (req, res) => {
        let id = req.params.id;
        let meeting = req.body;
        try {
            await updateMeeting(id, meeting);
            res.status(200).send(`Meeting ${meeting.name} was updated`);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    })
    .delete(async (req, res) => {
        let id = req.params.id;
        try {
            await deleteMeeting(id);
            res.status(200).send(`Meeting ${id} was deleted`);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

module.exports = router;
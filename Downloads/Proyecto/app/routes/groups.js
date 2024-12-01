"use strict";

const express = require("express");
const router = express.Router();
const { getGroups, getGroupByUUID, createGroup, updateGroup, deleteGroup } = require("../data/groups");

router.route("/")
    .get(async (req, res) => {
        let query = req.query.filter;
        let groups;
        try {
            groups = await getGroups();
            if (query) {
                groups = groups.filter(group => {
                    return group.name.includes(query) || group.description.includes(query);
                });
            }
            res.status(200).json(groups);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
});

router.route("/:id")
    .get(async (req, res) => {
        let id = req.params.id;
        let group;
        try {
            group = await getGroupByUUID(id);
            if (group) {
                res.status(200).json(group);
            } else {
                res.status(404).json({ error: "Group not found" });
            }
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
});

router.route('/')
    .post(async (req, res) => {
        let group = req.body;
        try {
            await createGroup(group);
            res.status(201).send(`Group ${group.name} was created`);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
});

router.route('/:id')
    .put(async (req, res) => {
        let id = req.params.id;
        let group = req.body;
        try {
            await updateGroup(id, group);
            res.status(200).send(`Group ${group.name} was updated`);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    })
    .delete(async (req, res) => {
        let id = req.params.id;
        try {
            await deleteGroup(id);
            res.status(200).send(`Group ${id} was deleted`);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
});

module.exports = router;
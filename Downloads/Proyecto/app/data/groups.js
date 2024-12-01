"use strict";

const mongoose = require("mongoose");

const Group = require("../controllers/group");

const groupSchema = new mongoose.Schema({
  _UUID: {
      type: String,
      required: true
  },
  _name: {
      type: String,
      required: true
  },
  _users: {
      type: [String],
      required: true
  }
});

const groupModel = mongoose.model("Group", groupSchema);

async function getGroups() {
  return await groupModel.find();
}

async function getGroupByUUID(uuid) {
  if (!uuid || typeof uuid !== 'string') {
    throw new Error("Invalid UUID format");
  }
  try {
    const group = await groupModel.findOne({
      "_UUID": uuid
    });
    if (!group) {
      console.error("Group not found with UUID:", uuid);
    }
    return group;
  } catch (error) {
    console.error("Error fetching group by UUID:", error);
    throw error;
  }
}

async function createGroup(group) {
  await groupModel.create(Group.createFromObject(group));
}

async function updateGroup(uuid, group) {
  await groupModel.updateOne({ _UUID: uuid }, group);
}

async function deleteGroup(uuid) {
  await groupModel.deleteOne({ _UUID: uuid });
}

module.exports = {
  getGroups,
  getGroupByUUID,
  createGroup,
  updateGroup,
  deleteGroup
};
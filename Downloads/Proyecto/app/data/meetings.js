"use strict";

const mongoose = require("mongoose");

const Meeting = require("../controllers/meeting");

const meetingSchema = new mongoose.Schema({
  _UUID: {
    type: String,
    required: true
  },
  _date: {
    type: Date,
    required: true
  },
  _time: {
    type: String,
    required: true
  },
  _purpose: {
    type: String,
    required: true
  },
  _description: {
    type: String,
    required: true
  },
  _location: {
    type: String,
    required: true
  },
  _groupUUID: {
    type: String,
    required: true
  }
});

const meetingModel = mongoose.model("Meeting", meetingSchema);

async function getMeetings() {
  return await meetingModel.find();
}

async function getMeetingByUUID(uuid) {
  if (!uuid || typeof uuid !== 'string') {
    throw new Error("Invalid UUID format");
  }
  try {
    const meeting = await meetingModel.findOne({
      "_UUID": uuid
    });
    if (!meeting) {
      console.error("Meeting not found with UUID:", uuid);
    }
    return meeting;
  } catch (error) {
    console.error("Error fetching meeting by UUID:", error);
    throw error;
  }
}

async function createMeeting(meeting) {
  await meetingModel.create(Meeting.createFromObject(meeting));
}

async function updateMeeting(uuid, meeting) {
  await meetingModel.updateOne({ _UUID: uuid }, meeting);
}

async function deleteMeeting(uuid) {
  await meetingModel.deleteOne({ _UUID: uuid });
}

module.exports = {
  getMeetings,
  getMeetingByUUID,
  createMeeting,
  updateMeeting,
  deleteMeeting
};
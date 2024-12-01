"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../controllers/user");

const userSchema = new mongoose.Schema({
  _UUID: {
    type: String,
    required: true
  },
  _firstName: {
    type: String,
    required: true
  },
  _lastName: {
    type: String,
    required: true
  },
  _email: {
    type: String,
    required: true
  },
  _password: {
    type: String,
    required: true
  },
  _urlImage: {
    type: String,
    required: false
  },
  _groupUUID: {
    type: String,
    required: false
  },
  _group: {
    type: String,
    required: false
  }
});


userSchema.pre("save", async function (next) {
  let user = this;
  user._password = await bcrypt.hash(user._password, 10); 
  next();
});


userSchema.methods.generateToken = function (_password) {
  let user = this;
  let payload = {
    _UUID: user._UUID,
    _lastName: user._lastName
  }
  let options = {
    expiresIn: "1d"
  }
  if (bcrypt.compare(_password, user._password)) {
    try {
      let token = jwt.sign(payload, process.env.JWT_KEY, options);
      return token;
    } catch (error) {
      console.log(error);
    }
  }
}

const userModel = mongoose.model("User", userSchema);

async function getUsers() {
  return await userModel.find();
}

async function getUserByUUID(uuid) {
  if (!uuid || typeof uuid !== 'string') {
    throw new Error("Invalid UUID format");
  }
  try {
    const user = await userModel.findOne({
      "_UUID": uuid
    });
    if (!user) {
      console.error("User not found with UUID:", uuid);
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error("Error fetching user by UUID:", error);
    throw error;
  }
}

async function getUserByEmail(email) {
  return await userModel.findOne({
    _email: email
  });
}

async function createUser(user) {
  await userModel.create(User.createFromObject(user));
}

async function updateUser(uuid, user) {
  await userModel.updateOne({
    _UUID: uuid
  }, user);
}

async function deleteUser(uuid) {
  await userModel.deleteOne({
    _UUID: uuid
  });
}


module.exports = {
  getUsers,
  getUserByUUID,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser
};
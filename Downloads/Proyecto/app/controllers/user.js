"use strict";

const {generateUUID} = require('../utils/utils');

class UserException extends Error {
    constructor(errorMessage) {
        super(errorMessage);
        this.name = "UserException";
    }
}

class User {    
    constructor(firstName, lastName, email, password, urlImage, groupUUID, group) {
        this._UUID = generateUUID();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.urlImage = urlImage;
        this.groupUUID = groupUUID;
        this.group = group;
    }

    get UUID() {
        return this._UUID;
    }
    set UUID(val) {
        throw new UserException('UUID is a read-only property :c');
    }

    get firstName() {
        return this._firstName;
    }
    set firstName(val) {
        if (typeof val !== 'string' || (val && val.trim() === '')) {
            throw new UserException('Invalid first name');
        }
        this._firstName = val;
    }

    get lastName() {
        return this._lastName;
    }
    set lastName(val) {
        if (typeof val !== 'string' || (val && val.trim() === '')) {
            throw new UserException('Invalid last name');
        }
        this._lastName = val;
    }

    get email() {
        return this._email;
    }
    set email(val) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
            throw new UserException('Invalid email');
        }
        this._email = val;
    }

    get password() {
        return this._password;
    }
    set password(val) {
        if (typeof val !== 'string' || val.length < 6) {
            throw new UserException('Password must be at least 6 characters long');
        }
        this._password = val;
    }

    get urlImage() {
        return this._urlImage;
    }
    set urlImage(val) {
        if (val && val.trim() === '') {
            this._urlImage = undefined;
        } else if (typeof val !== 'string') {
            throw new UserException('Invalid image URL');
        }
        this._urlImage = val;
    }

    get groupUUID() {
        return this._groupUUID;
    }
    set groupUUID(val) {
        if (val && val.trim() === '') {
            this.groupUUID = undefined;
        } else if (typeof val !== 'string') {
            throw new UserException('Invalid image groupUUID');
        }
        this._groupUUID = val;
    }

    get group() {
        return this._group;
    }
    set group(val) {
        if (typeof val !== 'string') {
            throw new UserException('Invalid group');
        }
        this._group = val;
    }

    static createFromJson(jsonValue) {
        let obj = JSON.parse(jsonValue);
        return User.createFromObject(obj);
    }

    static createFromObject(obj) {
        if (!obj._firstName || typeof obj._firstName !== "string") {
            throw new UserException("First name must be a non-empty string");
        }
        if (!obj._lastName || typeof obj._lastName !== "string") {
            throw new UserException("Last name must be a non-empty string");
        }
        if (!obj._email || typeof obj._email !== "string") {
            throw new UserException("Email must be a non-empty string");
        }
        if (!obj._password || typeof obj._password !== "string") {
            throw new UserException("Password must be a non-empty string");
        }
        let user = new User(
            obj._firstName,
            obj._lastName,
            obj._email,
            obj._password,
            obj._urlImage,
            obj._groupUUID,
            obj._group
        );
        if (obj._UUID) {
            user._UUID = obj._UUID; // Cambiado de User._UUID a user._UUID
        }
        return user;
    }

    static cleanObject(obj) {
        const userProperties = ['_UUID', '_firstName', '_lastName', '_email', '_password', '_urlImage', '_groupUUID', '_group'];
        for (let prop in obj) {
            if (!userProperties.includes(prop)) {
                delete obj[prop];
            }
        }
    }

}

module.exports = User;
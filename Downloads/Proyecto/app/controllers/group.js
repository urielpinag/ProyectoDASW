"use strict";

const {generateUUID} = require('../utils/utils');

class groupException extends Error {
    constructor(errorMessage) {
        super(errorMessage);
        this.name = "groupException";
    }
}

class Group {
    constructor(name, users = []) {
        this._UUID = generateUUID();
        this.name = name;
        this.users = users;
    }

    get UUID() {
        return this._UUID;
    }
    set UUID(val) {
        throw new groupException('UUID is a read-only property');
    }

    get name() {
        return this._name;
    }
    set name(val) {
        if (typeof val !== 'string' || val.trim() === '') {
            throw new groupException('Invalid group name');
        }
        this._name = val;
    }

    get users() {
        return this._users;
    }
    set users(val) {
        if (!Array.isArray(val)) {
            throw new groupException('Users must be an array');
        }
        this._users = val;
    }

    addUser(userUUID) {
        this._users.push(userUUID);
    }

    removeUser(userUUID) {
        this._users = this._users.filter(u => u !== userUUID);
    }

    static createFromJson(jsonvalue) {
        let obj = JSON.parse(jsonvalue);
        return Group.createFromObject(obj);
    }

    static createFromObject(obj) {
        if (!obj._name || typeof obj._name !== "string") {
            throw new groupException("Name must be a non-empty string");
        }
        let group = new Group(
            obj._name,
            obj._users
        );
        if (obj._uuid) {
            group._uuid = obj._uuid;
        }
        return group;
    }

    static cleanObject(obj) {
        const groupProperties = ['_uuid', '_name', '_users'];
        for (let prop in obj) {
            if (!groupProperties.includes(prop)) {
                delete obj[prop];
            }
        }
    }
}

module.exports = Group;
"use strict";

const {generateUUID} = require('../utils/utils');

const moment = require('moment');

class MeetingException extends Error {
    constructor(errorMessage) {
        super(errorMessage);
        this.name = "MeetingException";
    }
}

class Meeting {
    constructor(date, time, purpose, description, location, groupUUID) {
        this._UUID = generateUUID();
        this.date = date;
        this.time = time;
        this.purpose = purpose;
        this.description = description;
        this.location = location;
        this.groupUUID = groupUUID;
    }

    get UUID() {
        return this._UUID;
    }
    set UUID(val) {
        throw new MeetingException('UUID is a read-only property');
    }

    get date() {
        return this._date;
    }
    set date(val) {
        if (!moment(val, 'YYYY/MM/DD', true).isValid()) {
            throw new MeetingException('Invalid date format, expected YYYY/MM/DD');
        }
        this._date = val;
    }

    get time() {
        return this._time;
    }
    set time(val) {
        if (!moment(val, 'HH:mm', true).isValid()) {
            throw new MeetingException('Invalid time format, expected HH:mm');
        }
        this._time = val;
    }

    get purpose() {
        return this._purpose;
    }
    set purpose(val) {
        if (typeof val !== 'string' || val.trim() === '') {
            throw new MeetingException('Invalid purpose');
        }
        this._purpose = val;
    }

    get description() {
        return this._description;
    }
    set description(val) {
        if (typeof val !== 'string' || val.trim() === '') {
            throw new MeetingException('Invalid description');
        }
        this._description = val;
    }

    get location() {
        return this._location;
    }
    set location(val) {
        if (typeof val !== 'string' || val.trim() === '') {
            throw new MeetingException('Invalid location');
        }
        this._location = val;
    }

    get groupUUID() {
        return this._groupUUID;
    }
    set groupUUID(val) {
        if (typeof val !== 'string' || val.trim() === '') {
            throw new MeetingException('Invalid group UID');
        }
        this._groupUUID = val;
    }

    reschedule(newDate, newTime) {
        this.date = newDate;
        this.time = newTime;
    }

    updateDescription(newDescription) {
        this.description = newDescription;
    }

    changeLocation(newLocation) {
        this.location = newLocation;
    }

    static createFromJson(jsonValue) {
        let obj = JSON.parse(jsonValue);
        return Meeting.createFromObject(obj);
    }

    static createFromObject(obj) {
        if (!obj._date || !moment(obj._date, 'YYYY/MM/DD', true).isValid()) {
            throw new MeetingException("Invalid date format, expected YYYY/MM/DD");
        }
        if (!obj._time || !moment(obj._time, 'HH:mm', true).isValid()) {
            throw new MeetingException("Invalid time format, expected HH:mm");
        }
        if (!obj._purpose || typeof obj._purpose !== "string" || obj._purpose.trim() === '') {
            throw new MeetingException("Invalid purpose");
        }
        if (!obj._description || typeof obj._description !== "string" || obj._description.trim() === '') {
            throw new MeetingException("Invalid description");
        }
        if (!obj._location || typeof obj._location !== "string" || obj._location.trim() === '') {
            throw new MeetingException("Invalid location");
        }
        if (!obj._groupUUID || typeof obj._groupUUID !== "string" || obj._groupUUID.trim() === '') {
            throw new MeetingException("Invalid group UUID");
        }
        let meeting = new Meeting(
            obj._date,
            obj._time,
            obj._purpose,
            obj._description,
            obj._location,
            obj._groupUUID
        );
        if (obj._UUID) {
            meeting._UUID = obj._UUID;
        }
        return meeting;
    }

    static cleanObject(obj) {
        const meetingProperties = ['_UUID', '_date', '_time', '_purpose', '_description', '_location', '_groupUUID'];
        for (let prop in obj) {
            if (!meetingProperties.includes(prop)) {
                delete obj[prop];
            }
        }
    }

}

module.exports = Meeting;
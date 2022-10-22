"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ical_generator_1 = require("ical-generator");
/**
 * class for storing information about calendar events, with fields not included in the ical format,
 * time stored in UTC
 */
class CalendarEvent {
    constructor(title, description, type, startTime, endTime) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.startTime = startTime;
        this.endTime = endTime;
    }
    toICalData() {
        return {
            summary: this.title,
            description: `${this.type}: ${this.description}`,
            start: this.startTime,
            end: this.endTime,
        };
    }
}
/**
 * Class to manage calendar stuff more easily
 */
class Calendar {
    constructor() {
        this.events = [];
    }
    addEvent(event) {
        this.events.push(event);
    }
    /**
     * call .serve(res) to send over http
     */
    toICal() {
        let cal = new ical_generator_1.ICalCalendar({ name: "HRT Events" }); // maybe change this?
        for (let ev of this.events) {
            cal.createEvent(ev.toICalData());
        }
        return cal;
    }
}
//# sourceMappingURL=calendar.js.map
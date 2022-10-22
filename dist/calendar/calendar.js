"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleCal = exports.Calendar = exports.CalendarEvent = void 0;
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
exports.CalendarEvent = CalendarEvent;
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
exports.Calendar = Calendar;
function exampleCal() {
    let cal = new Calendar();
    cal.addEvent(new CalendarEvent("test event", "event to make sure this thing works", "Appointment", new Date("October 22, 2022, 09:00:00"), new Date("October 22, 2022, 10:00:00")));
    return cal;
}
exports.exampleCal = exampleCal;
//# sourceMappingURL=calendar.js.map
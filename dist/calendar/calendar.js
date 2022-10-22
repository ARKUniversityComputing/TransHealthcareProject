"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleCal = exports.Calendar = exports.CalendarEvent = void 0;
const ical_generator_1 = require("ical-generator");
// in case we want to add filtering, add more if necessary
var EventType;
(function (EventType) {
    EventType["Appointment"] = "Appointment";
    EventType["Dose"] = "Dose";
    EventType["Effect"] = "Effect";
})(EventType || (EventType = {}));
;
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
        this.allDay = !endTime;
    }
    toICalData() {
        return {
            summary: this.title,
            description: `${this.type}: ${this.description}`,
            start: this.startTime,
            end: this.endTime,
            allDay: this.allDay,
        };
    }
    isSameDay(other) {
        return this.startTime.getFullYear() === other.startTime.getFullYear() &&
            this.startTime.getMonth() === other.startTime.getMonth() &&
            this.startTime.getDate() === other.startTime.getDate();
    }
    toBgColor() {
        let color;
        switch (this.type) {
            case EventType.Effect:
                color = "#87e89c";
                break;
            case EventType.Dose:
                color = "#5da5d9";
                break;
            case EventType.Appointment:
                color = "#a494eb";
                break;
            default:
                color = "#ff00ff";
        }
        return color;
    }
}
exports.CalendarEvent = CalendarEvent;
/**
 * Class to manage calendar stuff more easily
 */
class Calendar {
    constructor(timezone) {
        var _a;
        this.events = [];
        (_a = this.timezone) !== null && _a !== void 0 ? _a : (this.timezone = "America/New_York"); // fine for testing and stuff
    }
    addEvent(event) {
        this.events.push(event);
        this.events.sort((a, b) => {
            if (a.startTime < b.startTime) {
                return -1;
            }
            if (b.startTime < a.startTime) {
                return 1;
            }
            return 0;
        });
    }
    /**
     * call .serve(res) to send over http
     */
    toICal() {
        let cal = new ical_generator_1.ICalCalendar({ name: "HRT Events", timezone: this.timezone }); // maybe change this?
        for (let ev of this.events) {
            cal.createEvent(ev.toICalData());
        }
        return cal;
    }
}
exports.Calendar = Calendar;
function dateToTimezone(date, timeZoneName) {
    return new Date(date.toLocaleString("en-US", { timeZone: timeZoneName }));
}
function exampleCal() {
    let cal = new Calendar();
    cal.addEvent(new CalendarEvent("test event 1", "event to make sure this thing works", EventType.Appointment, new Date("October 22, 2022, 11:00:00"), new Date("October 22, 2022, 16:00:00")));
    cal.addEvent(new CalendarEvent("test event 2", "event to make sure this thing works", EventType.Dose, new Date("October 22, 2022, 09:00:00"), new Date("October 22, 2022, 10:00:00")));
    cal.addEvent(new CalendarEvent("test event 3", "all day events?", EventType.Appointment, new Date("October 20, 2022")));
    cal.addEvent(new CalendarEvent("test event 4", "really long event", EventType.Effect, new Date("October 21, 2022"), new Date("October 22, 2023")));
    return cal;
}
exports.exampleCal = exampleCal;
//# sourceMappingURL=calendar.js.map
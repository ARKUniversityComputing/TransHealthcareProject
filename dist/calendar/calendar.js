"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleCal = exports.genCalendar = exports.Calendar = exports.CalendarEvent = void 0;
const ical_generator_1 = require("ical-generator");
const fs_1 = __importDefault(require("fs"));
// in case we want to add filtering, add more if necessary
var EventType;
(function (EventType) {
    EventType["Appointment"] = "Appointment";
    EventType["Dose"] = "Dose";
    EventType["Effect"] = "Possible Effect Onset Period";
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
function genCalendar(date, type) {
    let startDate = new Date(date);
    let cal = new Calendar();
    let rawEffectData = fs_1.default.readFileSync("res/effectonset.json");
    let effectData = JSON.parse(rawEffectData.toString());
    let effects = type === "fem" ? effectData.feminizing.effects : effectData.masculinizing.effects;
    for (const effect of effects) {
        let onsetStart = new Date(startDate.getTime());
        onsetStart.setFullYear(onsetStart.getFullYear() + effect.start.years);
        onsetStart.setMonth(onsetStart.getMonth() + effect.start.months);
        onsetStart.setDate(onsetStart.getDate() + effect.start.days);
        let onsetEnd = new Date(startDate.getTime());
        onsetEnd.setFullYear(onsetEnd.getFullYear() + effect.end.years);
        onsetEnd.setMonth(onsetEnd.getMonth() + effect.end.months);
        onsetEnd.setDate(onsetEnd.getDate() + effect.end.days);
        cal.addEvent(new CalendarEvent(effect.title, effect.summary, EventType.Effect, onsetStart, onsetEnd));
    }
    return cal;
}
exports.genCalendar = genCalendar;
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
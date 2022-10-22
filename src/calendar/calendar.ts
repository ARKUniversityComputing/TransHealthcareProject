import { ICalCalendar, ICalEventData } from "ical-generator";
import fs from "fs";

// in case we want to add filtering, add more if necessary
enum EventType {
    Appointment = "Appointment",
    Dose = "Dose",
    Effect = "Possible Effect Onset Period",
};

/**
 * class for storing information about calendar events, with fields not included in the ical format,
 * time stored in UTC
 */
export class CalendarEvent {
    title: string;
    description: string;
    type: EventType;
    startTime: Date;
    endTime: Date;
    allDay: boolean;

    constructor(title: string, description: string, type: EventType, startTime: Date, endTime?: Date) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.startTime = startTime;
        this.endTime = endTime;
        this.allDay = !endTime;
    }

    toICalData(): ICalEventData {
        return {
            summary: this.title,
            description: `${this.type}: ${this.description}`,
            start: this.startTime,
            end: this.endTime,
            allDay: this.allDay,
        };
    }


    isSameDay(other: CalendarEvent): boolean {
        return this.startTime.getFullYear() === other.startTime.getFullYear() &&
            this.startTime.getMonth() === other.startTime.getMonth() &&
            this.startTime.getDate() === other.startTime.getDate();
    }

    toBgColor(): string {
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

/**
 * Class to manage calendar stuff more easily
 */
export class Calendar {
    events: CalendarEvent[];
    timezone: string;
    constructor(timezone?: string) {
        this.events = [];
        this.timezone ??= "America/New_York"; // fine for testing and stuff
    }

    addEvent(event: CalendarEvent) {
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
    toICal(): ICalCalendar {
        let cal = new ICalCalendar({ name: "HRT Events", timezone: this.timezone }); // maybe change this?
        for (let ev of this.events) {
            cal.createEvent(ev.toICalData());
        }
        return cal;
    }
}

export function genCalendar(date: string, type: "fem" | "masc"): Calendar {
    let startDate = new Date(date);
    let cal = new Calendar();

    let rawEffectData = fs.readFileSync("res/effectonset.json");
    let effectData = JSON.parse(rawEffectData.toString());
    let effects = type === "fem" ? effectData.feminizing.effects : effectData.masculinizing.effects;

    for (const effect of effects) {
        let onsetStart = new Date(startDate.getTime());
        onsetStart.setFullYear(onsetStart.getFullYear() + effect.start.years)
        onsetStart.setMonth(onsetStart.getMonth() + effect.start.months)
        onsetStart.setDate(onsetStart.getDate() + effect.start.days);

        let onsetEnd = new Date(startDate.getTime());
        onsetEnd.setFullYear(onsetEnd.getFullYear() + effect.end.years)
        onsetEnd.setMonth(onsetEnd.getMonth() + effect.end.months)
        onsetEnd.setDate(onsetEnd.getDate() + effect.end.days);

        cal.addEvent(new CalendarEvent(
            effect.title,
            effect.summary,
            EventType.Effect,
            onsetStart,
            onsetEnd,
        ));
    }


    return cal;
}

export function exampleCal(): Calendar {
    let cal = new Calendar();

    cal.addEvent(new CalendarEvent(
        "test event 1",
        "event to make sure this thing works",
        EventType.Appointment,
        new Date("October 22, 2022, 11:00:00"),
        new Date("October 22, 2022, 16:00:00"),
    ));

    cal.addEvent(new CalendarEvent(
        "test event 2",
        "event to make sure this thing works",
        EventType.Dose,
        new Date("October 22, 2022, 09:00:00"),
        new Date("October 22, 2022, 10:00:00"),
    ));

    cal.addEvent(new CalendarEvent(
        "test event 3",
        "all day events?",
        EventType.Appointment,
        new Date("October 20, 2022"),
    ));

    cal.addEvent(new CalendarEvent(
        "test event 4",
        "really long event",
        EventType.Effect,
        new Date("October 21, 2022"),
        new Date("October 22, 2023"),
    ));

    return cal;
}

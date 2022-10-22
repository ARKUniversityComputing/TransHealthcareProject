import { ICalCalendar, ICalEventData } from "ical-generator";

// in case we want to add filtering, add more if necessary
type EventType = "Effect" | "Appointment" | "Dose";

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


    constructor(title: string, description: string, type: EventType, startTime: Date, endTime: Date) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    toICalData(): ICalEventData {
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
export class Calendar {
    events: CalendarEvent[];
    constructor() {
        this.events = [];
    }

    addEvent(event: CalendarEvent) {
        this.events.push(event);
    }

    /**
     * call .serve(res) to send over http
     */
    toICal(): ICalCalendar {
        let cal = new ICalCalendar({ name: "HRT Events" }); // maybe change this?
        for (let ev of this.events) {
            cal.createEvent(ev.toICalData());
        }
        return cal;
    }
}

export function exampleCal(): Calendar {
    let cal = new Calendar();

    cal.addEvent(new CalendarEvent(
        "test event",
        "event to make sure this thing works",
        "Appointment",
        new Date("October 22, 2022, 09:00:00"),
        new Date("October 22, 2022, 10:00:00"),
    ));

    return cal;
}

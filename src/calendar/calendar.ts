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
            case "Effect":
                color = "#87e89c"
                break;
            case "Dose":
                color = "#5da5d9"
                break;
            case "Appointment":
                color = "#a494eb"
                break;
            default:
                color = "#ff00ff"
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
        this.timezone ??= "America/New_York" // fine for testing and stuff
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
        let cal = new ICalCalendar({ name: "HRT Events", timezone: this.timezone}); // maybe change this?
        for (let ev of this.events) {
            cal.createEvent(ev.toICalData());
        }
        return cal;
    }
}

function dateToTimezone(date: Date, timeZoneName: string): Date {
    return new Date(date.toLocaleString("en-US", {timeZone: timeZoneName}));
}

export function exampleCal(): Calendar {
    let cal = new Calendar();

    cal.addEvent(new CalendarEvent(
        "test event 1",
        "event to make sure this thing works",
        "Appointment",
        new Date("October 22, 2022, 11:00:00"),
        new Date("October 22, 2022, 16:00:00"),
    ));

    cal.addEvent(new CalendarEvent(
        "test event 2",
        "event to make sure this thing works",
        "Dose",
        new Date("October 22, 2022, 09:00:00"),
        new Date("October 22, 2022, 10:00:00"),
    ));

    cal.addEvent(new CalendarEvent(
        "test event 3",
        "all day events?",
        "Appointment",
        new Date("October 20, 2022"),
    ));

    cal.addEvent(new CalendarEvent(
        "test event 4",
        "really long event",
        "Effect",
        new Date("October 21, 2022"),
        new Date("October 22, 2023"),
    ))

    return cal;
}

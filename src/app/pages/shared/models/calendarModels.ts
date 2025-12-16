export type CalendarEvent = {
    Id?: string;
    Subject: string;
    StartTime: Date;
    EndTime: Date;
    IsAllDay?: boolean;
    ExtendedProps?: Record<string, any>;
};

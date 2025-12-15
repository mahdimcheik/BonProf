export type CalendarEvent = {
    id?: number;
    subject: string;
    startTime: Date;
    endTime: Date;
    isAllDay?: boolean;
};

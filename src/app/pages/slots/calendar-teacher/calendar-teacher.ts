import { Component, computed, model } from '@angular/core';
import { DayService, DragAndDropService, MonthService, ResizeService, ScheduleModule, WeekService, WorkWeekService } from '@syncfusion/ej2-angular-schedule';

@Component({
    imports: [ScheduleModule],
    standalone: true,
    selector: 'bp-calendar-teacher',
    templateUrl: './calendar-teacher.html',
    providers: [DayService, WeekService, WorkWeekService, MonthService, ResizeService, DragAndDropService]
})
export class CalendarTeacher {
    // Input for events data
    events = model<any[]>([]);

    // Calendar configuration
    public selectedDate: Date = new Date();

    // public eventSettings: any = {
    //     dataSource: []
    // };
    public eventSettings = computed(() => {
        return {
            dataSource: this.events()
        };
    });

    // Work hours: 9 AM to 8 PM
    public startHour = '09:00';
    public endHour = '20:00';

    // Time scale configuration (30-minute intervals)
    public timeScale = {
        enable: true,
        interval: 60,
        slotCount: 2
    };

    constructor() {
        // Update eventSettings when events change
        // effect(() => {
        //     this.eventSettings = {
        //         dataSource: this.events()
        //     };
        // });
    }
}

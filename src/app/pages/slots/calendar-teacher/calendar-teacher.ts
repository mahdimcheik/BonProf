import { Component, computed, model, viewChild } from '@angular/core';
import { DayService, DragAndDropService, MonthService, PopupOpenEventArgs, ResizeService, ScheduleComponent, ScheduleModule, WeekService, WorkWeekService } from '@syncfusion/ej2-angular-schedule';

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
    scheduleRef = viewChild<ScheduleComponent>('scheduleRef');

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

    // Method to control drag and drop permission
    onDragStart(args: any): void {
        // Add your rules here
        // Example: Prevent dragging events in the past
        const eventStartTime = new Date(args.data.StartTime);
        const now = new Date();

        if (eventStartTime < now) {
            args.cancel = true;
        }

        // Example: Prevent dragging specific event types
        // if (args.data.IsReadOnly) {
        //     args.cancel = true;
        // }
    }

    // Method to control resize permission
    onResizeStart(args: any): void {
        // Add your rules here
        // Example: Prevent resizing events in the past
        const eventStartTime = new Date(args.data.StartTime);
        const now = new Date();

        if (eventStartTime < now) {
            args.cancel = true;
        }

        // Example: Prevent resizing specific event types
        // if (args.data.IsReadOnly) {
        //     args.cancel = true;
        // }
    }

    // Optional: Validate drag/drop destination
    onDragStop(args: any): void {
        // Add validation rules for the drop location
        // Example: Prevent dropping on weekends
        // const dropDate = new Date(args.data.StartTime);
        // if (dropDate.getDay() === 0 || dropDate.getDay() === 6) {
        //     args.cancel = true;
        // }
    }

    // Optional: Validate resize result
    onResizeStop(args: any): void {
        // Add validation rules for resize result
        // Example: Ensure minimum duration
        // const duration = args.data.EndTime - args.data.StartTime;
        // const minDuration = 30 * 60 * 1000; // 30 minutes
        // if (duration < minDuration) {
        //     args.cancel = true;
        // }
    }

    // click on cell
    onCellClick(event: any) {
        console.log('cell click', event);
        this.selectedDate = event.startTime;
    }

    // open  create modal
    public onPopupOpen(args: PopupOpenEventArgs): void {
        // On vérifie si c'est la popup d'édition ou de création rapide
        if (args.type === 'Editor' || args.type === 'QuickInfo') {
            // 1. On annule l'ouverture de la fenêtre Syncfusion
            args.cancel = true;

            // 2. On récupère les infos du créneau cliqué (Date début, fin, etc.)
            const dataClick = args.data;

            // 3. On ouvre notre propre modal de création/édition avec les infos récupérées
        }
    }
}

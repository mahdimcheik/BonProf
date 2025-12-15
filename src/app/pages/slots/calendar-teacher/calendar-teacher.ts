import { Component, computed, model, signal, viewChild } from '@angular/core';
import { DayService, DragAndDropService, MonthService, PopupOpenEventArgs, ResizeService, ScheduleComponent, ScheduleModule, WeekService, WorkWeekService } from '@syncfusion/ej2-angular-schedule';
import { ModalCreateSlot } from '../modal-create-slot/modal-create-slot';

@Component({
    imports: [ScheduleModule, ModalCreateSlot],
    standalone: true,
    selector: 'bp-calendar-teacher',
    templateUrl: './calendar-teacher.html',
    providers: [DayService, WeekService, WorkWeekService, MonthService, ResizeService, DragAndDropService]
})
export class CalendarTeacher {
    // Input for events data
    events = model<any[]>([]);
    visibleCreateSlotModal = signal(false);
    scheduleRef = viewChild<ScheduleComponent>('scheduleRef');

    // Calendar configuration
    public selectedDate: Date = new Date();

    public eventSettings = computed(() => {
        return {
            dataSource: this.events()
        };
    });

    // Work hours: 9 AM to 8 PM
    public startHour = '09:00';
    public endHour = '22:00';

    // Time scale configuration (30-minute intervals)
    public timeScale = {
        enable: true,
        interval: 60,
        slotCount: 2
    };

    // Method to control drag and drop permission
    onDragStart(args: any): void {
        const eventStartTime = new Date(args.data.StartTime);
        const now = new Date();

        if (eventStartTime < now) {
            args.cancel = true;
        }
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
    }

    onDragStop(args: any): void {
        if (args.data.StartTime < new Date()) {
            args.cancel = true;
        }
    }

    onResizeStop(args: any): void {
        if (args.data.StartTime < new Date()) {
            args.cancel = true;
        }
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
            this.visibleCreateSlotModal.set(true);
        }
    }
}

import { CalendarEvent } from '@/pages/shared/models/calendarModels';
import { MainService } from '@/pages/shared/services/main.service';
import { SlotWrapperService } from '@/pages/shared/services/slot-wrapper-service';
import { DatePipe } from '@angular/common';
import { Component, computed, inject, model, OnInit, signal, viewChild } from '@angular/core';
import {
    CellClickEventArgs,
    DayService,
    DragAndDropService,
    EventClickArgs,
    EventRenderedArgs,
    MonthService,
    PopupOpenEventArgs,
    ResizeService,
    ScheduleComponent,
    ScheduleModule,
    WeekService,
    WorkWeekService
} from '@syncfusion/ej2-angular-schedule';
import { firstValueFrom } from 'rxjs';
import { SlotCreate, SlotDetails } from 'src/client';
import { ModalCreateSlot } from '../modal-create-slot/modal-create-slot';
// Fallback require for CLDR JSON to avoid TS type resolution issues
declare const require: any;
@Component({
    imports: [ScheduleModule, ModalCreateSlot, DatePipe],
    standalone: true,
    selector: 'bp-calendar-teacher',
    templateUrl: './calendar-teacher.html',
    providers: [DayService, WeekService, WorkWeekService, MonthService, ResizeService, DragAndDropService]
})
export class CalendarTeacher implements OnInit {
    mainService = inject(MainService);
    slotWrapperService = inject(SlotWrapperService);
    // Input for events data
    events = model<CalendarEvent[]>([]);
    visibleCreateSlotModal = signal(false);
    scheduleRef = viewChild<ScheduleComponent>('scheduleRef');
    // Locale
    public locale = 'fr';

    // Calendar configuration
    public selectedDate: CalendarEvent = {
        StartTime: new Date(2025, 11, 15, 21, 0),
        EndTime: new Date(2025, 11, 15, 21, 30),
        Subject: ''
    };

    selectedSlot = model<SlotDetails | null>(null);

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
    ngOnInit(): void {
        this.loadData();
    }

    async loadData() {
        const events = await firstValueFrom(this.slotWrapperService.getSlotsByTeacher(new Date(2025, 11, 1), new Date(2025, 11, 30)));
        this.events.set(events?.map((e) => this.slotToEvent(e)) ?? []);
        console.log(this.events());
    }

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
    onCellClick(event: CellClickEventArgs) {
        this.selectedSlot.set(null);
        this.selectedDate = {
            StartTime: new Date(event.startTime.toISOString()),
            EndTime: new Date(event.endTime.toISOString()),
            Subject: '',
            ExtendedProps: { slot: null }
        };
        this.visibleCreateSlotModal.set(true);
    }

    // open  create modal
    public onPopupOpen(args: PopupOpenEventArgs): void {
        args.cancel = true;
    }

    clickEvent(event: EventClickArgs) {
        const selectedEvent = event.event as any;
        this.selectedSlot.set(selectedEvent?.ExtendedProps?.slot ?? null);
        console.log('slot', event);

        // Handle Date objects properly - they're already Date instances, not strings
        const startTime = selectedEvent?.StartTime;
        const endTime = selectedEvent?.EndTime;

        this.selectedDate = {
            StartTime: startTime instanceof Date ? new Date(startTime) : new Date(),
            EndTime: endTime instanceof Date ? new Date(endTime) : new Date(),
            Subject: '',
            ExtendedProps: { slot: this.selectedSlot() }
        };
        this.visibleCreateSlotModal.set(true);
    }

    async handleEvent(event: any) {
        const newEvent: SlotCreate = {
            dateFrom: event.dateFrom,
            dateTo: event.dateTo,
            typeId: event.extendedProps?.['typeSlotId'] || '',
            teacherId: this.mainService.userConnected().id
        };

        console.log('newEvent', newEvent);
        try {
            const res = await firstValueFrom(this.slotWrapperService.addSlot(newEvent));
            await this.loadData();
        } catch (ex) {
            console.log('exception : ', ex);
        }
    }

    slotToEvent(slot: SlotDetails): CalendarEvent {
        return {
            StartTime: new Date(slot.dateFrom),
            EndTime: new Date(slot.dateTo),
            Id: slot.id,
            Subject: 'subject',
            ExtendedProps: {
                slot: slot,
                BgColor: slot.type?.color
            }
        };
    }

    // styles signals
    applyBgColor(args: EventRenderedArgs): void {
        const slot = (args.data as any).ExtendedProps?.['slot'] as SlotDetails;
        args.element.style.backgroundColor = slot.type?.color || 'transparent';
        args.element.style.borderRadius = '4px';
        args.element.style.border = ' 1px solid #ccc';
        args.element.style.padding = '8px';
    }
}

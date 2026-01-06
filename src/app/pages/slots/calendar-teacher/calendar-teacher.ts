import { MainService } from '@/pages/shared/services/main.service';
import { SlotWrapperService } from '@/pages/shared/services/slot-wrapper-service';
import { DatePipe } from '@angular/common';
import { Component, computed, inject, model, OnInit, signal, viewChild } from '@angular/core';
import {
    ActionEventArgs,
    CellClickEventArgs,
    DayService,
    DragAndDropService,
    EventClickArgs,
    EventRenderedArgs,
    MonthService,
    NavigatingEventArgs,
    PopupOpenEventArgs,
    ResizeService,
    ScheduleComponent,
    ScheduleModule,
    WeekService,
    WorkWeekService
} from '@syncfusion/ej2-angular-schedule';
import { firstValueFrom } from 'rxjs';
import { SlotCreate, SlotDetails, SlotUpdate } from 'src/client';
import { ModalCreateSlot } from '../modal-create-slot/modal-create-slot';
import { CalendarEvent } from '@/pages/shared/models/calendar-models';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ConfirmModalComponent } from '@/pages/components/confirm-modal/confirm-modal.component';
// Fallback require for CLDR JSON to avoid TS type resolution issues
declare const require: any;
@Component({
    imports: [ScheduleModule, DatePipe, ModalCreateSlot, Button, Tooltip, ConfirmModalComponent],
    standalone: true,
    selector: 'bp-calendar-teacher',
    templateUrl: './calendar-teacher.html',
    providers: [DayService, WeekService, WorkWeekService, MonthService, ResizeService, DragAndDropService]
})
export class CalendarTeacher implements OnInit {
    mainService = inject(MainService);
    slotWrapperService = inject(SlotWrapperService);
    messageService = inject(MessageService);
    // Input for events data
    events = model<CalendarEvent[]>([]);
    visibleCreateSlotModal = signal(false);
    visibleConfirmDeleteModal = signal(false);
    scheduleRef = viewChild<ScheduleComponent>('scheduleRef');
    private isLoading = false;
    private isInitialized = false;
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
        // Initial load will be triggered after scheduler is rendered
    }

    async loadData(startTime: Date, endTime: Date) {
        if (this.isLoading) return;

        this.isLoading = true;
        try {
            const events = await firstValueFrom(this.slotWrapperService.getSlotsByTeacher(startTime, endTime));
            this.events.set(events?.map((e) => this.slotToEvent(e)) ?? []);
        } finally {
            this.isLoading = false;
        }
    }

    // Called when scheduler is rendered or view changes
    onDataBound(args: any): void {
        // Only load data on first render
        if (!this.isInitialized) {
            this.isInitialized = true;
            const schedule = this.scheduleRef();
            if (schedule) {
                const activeView = schedule.activeView;
                const startDate = activeView.startDate();
                const endDate = activeView.endDate();
                this.loadData(startDate, endDate);
            }
        }
    }

    // Called when navigating to different dates - let onActionComplete handle the loading
    onNavigating(args: NavigatingEventArgs): void {
        // This event fires before navigation completes
        // We'll let onActionComplete handle the actual data loading
    }

    // Called when action is completed (including view changes)
    onActionComplete(args: ActionEventArgs): void {
        if (args.requestType === 'viewNavigate' || args.requestType === 'dateNavigate') {
            const schedule = this.scheduleRef();
            if (schedule) {
                const activeView = schedule.activeView;
                const startDate = activeView.startDate();
                const endDate = activeView.endDate();

                this.loadData(startDate, endDate);
            }
        }
    }

    // Helper to get the start of the week (Sunday)
    private getWeekStart(date: Date): Date {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
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

        const selectedEvent = args.data as any;
        this.selectedSlot.set(selectedEvent?.ExtendedProps?.slot ?? null);

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

    onResizeStop(args: any): void {
        const events = this.events();
        if (args.data.StartTime < new Date()) {
            args.cancel = true;
        }

        events.forEach((event) => {
            if (this.isOverlaping(args.data, event) && event.Id !== args.data.Id) {
                args.cancel = true;
            }
        });

        const selectedEvent = args.data as any;
        this.selectedSlot.set(selectedEvent?.ExtendedProps?.slot ?? null);

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

    private isOverlaping(event1: CalendarEvent, event2: CalendarEvent): boolean {
        return event1.StartTime < event2.EndTime && event2.StartTime < event1.EndTime;
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

    async handleEvent(event: SlotCreate | SlotUpdate) {
        const id = event && 'id' in event ? event.id : undefined;
        if (id) {
            teacherId: this.mainService.userConnected().id;
            const updatedEvent: SlotUpdate = { ...event, teacherId: this.mainService.userConnected().id } as SlotUpdate;

            try {
                const res = await firstValueFrom(this.slotWrapperService.updateSlot(updatedEvent));
                await this.refreshCurrentView();
            } catch (ex) {
                console.log('exception : ', ex);
            }
        } else {
            const newEvent: SlotCreate = {
                dateFrom: event.dateFrom,
                dateTo: event.dateTo,
                typeId: event.typeId,
                teacherId: this.mainService.userConnected().id
            };

            try {
                const res = await firstValueFrom(this.slotWrapperService.addSlot(newEvent));
                await this.refreshCurrentView();
            } catch (ex) {
                console.log('exception : ', ex);
            }
        }
    }

    async cancel() {
        await this.refreshCurrentView();
    }

    openConfirmDeleteModal(event: Event, slot: SlotDetails) {
        event.stopPropagation();
        this.selectedSlot.set(slot);
        this.visibleConfirmDeleteModal.set(true);
    }

    async removeSlot() {
        try {
            const slotId = this.selectedSlot()?.id;
            if (!slotId) {
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'ID du créneau manquant.' });
                return;
            }
            await firstValueFrom(this.slotWrapperService.removeSlotById(slotId));
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Le créneau a été supprimé avec succès.' });
        } catch (ex) {
            console.log('exception : ', ex);
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la suppression du créneau.' });
        } finally {
            await this.refreshCurrentView();
        }
    }

    // Refresh data for the current view
    private async refreshCurrentView() {
        const schedule = this.scheduleRef();
        if (schedule) {
            const activeView = schedule.activeView;
            const startDate = activeView.startDate();
            const endDate = activeView.endDate();
            await this.loadData(startDate, endDate);
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

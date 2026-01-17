import { MainService } from '@/pages/shared/services/main.service';
import { SlotWrapperService } from '@/pages/shared/services/slot-wrapper-service';
import { CommonModule, DatePipe } from '@angular/common';
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
import { loadCldr, L10n, setCulture } from '@syncfusion/ej2-base';
import { firstValueFrom } from 'rxjs';
import { ReservationDetails, SlotCreate, SlotDetails, SlotUpdate, StatusReservationCode, StatusReservationDetails } from 'src/client';
import { ModalCreateSlot } from '../modal-create-slot/modal-create-slot';
import { CalendarEvent } from '@/pages/shared/models/calendar-models';
import { MessageService } from 'primeng/api';
import { ConfirmModalComponent } from '@/pages/components/confirm-modal/confirm-modal.component';

// Load CLDR data for French locale
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as gregorian from 'cldr-data/main/fr/ca-gregorian.json';
import * as numbers from 'cldr-data/main/fr/numbers.json';
import * as timeZoneNames from 'cldr-data/main/fr/timeZoneNames.json';
import { ModalReservation } from '../modal-reservation/modal-reservation';
import { StatusReservationWrapperService } from '@/pages/shared/services/status-reservation-wrapper-service';

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames);

// Set French translations for Schedule
L10n.load({
    fr: {
        schedule: {
            day: 'Jour',
            week: 'Semaine',
            workWeek: 'Semaine de travail',
            month: 'Mois',
            today: "Aujourd'hui",
            noEvents: 'Aucun événement',
            allDay: 'Toute la journée',
            start: 'Début',
            end: 'Fin',
            more: 'Plus',
            close: 'Fermer',
            cancel: 'Annuler',
            noTitle: '(Sans titre)',
            delete: 'Supprimer',
            deleteEvent: "Supprimer l'événement",
            deleteMultipleEvent: 'Supprimer plusieurs événements',
            selectedItems: 'Éléments sélectionnés',
            deleteSeries: 'Supprimer la série',
            edit: 'Modifier',
            editSeries: 'Modifier la série',
            editEvent: "Modifier l'événement",
            createEvent: 'Créer',
            subject: 'Sujet',
            addTitle: 'Ajouter un titre',
            moreDetails: 'Plus de détails',
            save: 'Enregistrer',
            editContent: 'Voulez-vous modifier uniquement cet événement ou la série entière?',
            deleteContent: 'Êtes-vous sûr de vouloir supprimer cet événement?',
            deleteMultipleContent: 'Êtes-vous sûr de vouloir supprimer les événements sélectionnés?',
            newEvent: 'Nouvel événement',
            title: 'Titre',
            location: 'Lieu',
            description: 'Description',
            timezone: 'Fuseau horaire',
            startTimezone: 'Fuseau horaire de début',
            endTimezone: 'Fuseau horaire de fin',
            repeat: 'Répéter',
            saveButton: 'Enregistrer',
            cancelButton: 'Annuler',
            deleteButton: 'Supprimer',
            recurrence: 'Récurrence',
            wrongPattern: 'Le modèle de récurrence est invalide.',
            seriesChangeAlert: 'Les modifications apportées à des instances spécifiques de cette série seront annulées.',
            createError: "La durée de l'événement doit être inférieure à sa fréquence.",
            sameDayAlert: 'Deux occurrences du même événement ne peuvent pas avoir lieu le même jour.',
            occurrence: 'Occurrence',
            series: 'Série',
            previous: 'Précédent',
            next: 'Suivant',
            timelineDay: 'Jour (Timeline)',
            timelineWeek: 'Semaine (Timeline)',
            timelineWorkWeek: 'Semaine de travail (Timeline)',
            timelineMonth: 'Mois (Timeline)'
        }
    }
});

setCulture('fr');
@Component({
    imports: [ScheduleModule, DatePipe, ModalCreateSlot, ConfirmModalComponent, ModalReservation, CommonModule],
    standalone: true,
    selector: 'bp-calendar-teacher',
    templateUrl: './calendar-teacher.html',
    providers: [DayService, WeekService, WorkWeekService, MonthService, ResizeService, DragAndDropService]
})
export class CalendarTeacher implements OnInit {
    mainService = inject(MainService);
    slotWrapperService = inject(SlotWrapperService);
    messageService = inject(MessageService);
    statusReservationService = inject(StatusReservationWrapperService);
    // Input for events data
    events = model<CalendarEvent[]>([]);
    visibleCreateSlotModal = signal(false);
    visibleConfirmDeleteModal = signal(false);
    visibleReservationDetailsModal = signal(false);
    scheduleRef = viewChild<ScheduleComponent>('scheduleRef');
    private isLoading = false;
    private isInitialized = false;
    // Locale
    public locale = 'fr';

    // type enums
    public pending = StatusReservationCode.Pending;
    public accepted = StatusReservationCode.Accepted;
    public rejected = StatusReservationCode.Rejected;
    public done = StatusReservationCode.Done;

    // status reservations options
    statusReservations = this.statusReservationService.statusReservations;

    // Calendar configuration
    public selectedDate!: CalendarEvent;

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
    ngOnInit(): void {}

    async loadData(startTime: Date, endTime: Date) {
        this.statusReservationService.getAllStatusReservations();
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

    onNavigating(args: NavigatingEventArgs): void {}

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

    // Method to control drag and drop permission
    onDragStart(args: any): void {
        const eventStartTime = new Date(args.data.StartTime);
        const now = new Date();

        if (eventStartTime < now) {
            args.cancel = true;
        }
        const reservation = args.data.ExtendedProps?.slot?.reservation;

        if (reservation) {
            args.cancel = true;
            return;
        }
    }

    // Method to control resize permission
    onResizeStart(args: any): void {
        // Add your rules here
        // Example: Prevent resizing events in the past
        const eventStartTime = new Date(args.data.StartTime);
        const now = new Date();
        const reservation = args.data.ExtendedProps?.slot?.reservation;

        if (reservation) {
            args.cancel = true;
            return;
        }

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
        this.selectedDate = event.event as CalendarEvent;

        if (this.selectedSlot()?.reservation) {
            this.visibleReservationDetailsModal.set(true);
            return;
        }

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
    // reservations
    async validateReservation(reservation: ReservationDetails | null) {
        if (!reservation || !reservation.id) {
            this.messageService.add({ severity: 'danger', summary: 'Echec', detail: 'La réservation est invalide.' });
            return;
        }

        try {
            await firstValueFrom(this.slotWrapperService.confirmReservation(reservation.id));
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'La réservation a été confirmée avec succès.' });
        } catch (ex: any) {
            this.messageService.add({ severity: 'danger', summary: 'Echec', detail: ex?.error?.message || 'Une erreur est survenue lors de la confirmation de la réservation.' });
            console.log('exception : ', ex);
        } finally {
            await this.refreshCurrentView();
            this.visibleReservationDetailsModal.set(false);
        }
    }

    async removeReservation(reservation: ReservationDetails) {
        if (!reservation || !reservation.id) {
            this.messageService.add({ severity: 'danger', summary: 'Echec', detail: 'La réservation est invalide.' });
            return;
        }

        try {
            await firstValueFrom(this.slotWrapperService.removeReservation(reservation.id));
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'La réservation a été annulée avec succès.' });
        } catch (ex: any) {
            this.messageService.add({ severity: 'danger', summary: 'Echec', detail: ex?.error?.message || "Une erreur est survenue lors de l'annulation de la réservation." });
            console.log('exception : ', ex);
        } finally {
            await this.refreshCurrentView();
            this.visibleReservationDetailsModal.set(false);
        }
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

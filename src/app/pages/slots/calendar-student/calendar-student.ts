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
import { ReservationCreate, ReservationDetails, SlotCreate, SlotDetails, SlotUpdate } from 'src/client';
import { CalendarEvent } from '@/pages/shared/models/calendar-models';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { loadCldr, L10n, setCulture } from '@syncfusion/ej2-base';
import { ModalBookSlot } from '../modal-book-slot/modal-book-slot';
import { Divider } from 'primeng/divider';

// Load CLDR data for French locale
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as gregorian from 'cldr-data/main/fr/ca-gregorian.json';
import * as numbers from 'cldr-data/main/fr/numbers.json';
import * as timeZoneNames from 'cldr-data/main/fr/timeZoneNames.json';
import { ModalReservationStudent } from '../modal-reservation-student/modal-reservation-student';

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
    imports: [ScheduleModule, DatePipe, ModalBookSlot, Divider, ModalReservationStudent],
    standalone: true,
    selector: 'bp-calendar-student',
    templateUrl: './calendar-student.html',
    providers: [DayService, WeekService, WorkWeekService, MonthService, ResizeService, DragAndDropService]
})
export class CalendarStudent implements OnInit {
    mainService = inject(MainService);
    slotWrapperService = inject(SlotWrapperService);
    messageService = inject(MessageService);
    activatedRoute = inject(ActivatedRoute);

    // Input for events data
    events = model<CalendarEvent[]>([]);
    visibleBookSlotModal = signal(false);
    visibleReservationModal = signal(false);
    scheduleRef = viewChild<ScheduleComponent>('scheduleRef');
    private isLoading = false;
    private isInitialized = false;

    teacherId = signal<string | null>(null);
    myUser = computed(() => this.mainService.userConnected());

    // Locale
    public locale = 'fr';

    // Calendar configuration
    public selectedDate!: CalendarEvent;

    selectedSlot = model<SlotDetails | null>(null);
    reservation = computed(() => this.selectedSlot()?.reservation ?? null);

    public eventSettings = computed(() => {
        return {
            dataSource: this.events()
        };
    });

    // Work hours: 9 AM to 8 PM
    public startHour = '09:00';
    public endHour = '22:00';

    public timeScale = {
        enable: true,
        interval: 60,
        slotCount: 2
    };

    ngOnInit(): void {
        const teacherId = this.activatedRoute.snapshot.queryParams['teacherId'];
        this.teacherId.set(teacherId ?? null);
    }

    async loadData(startTime: Date, endTime: Date) {
        if (this.isLoading) return;
        this.isLoading = true;
        try {
            const slots = await firstValueFrom(this.slotWrapperService.getSlotsByStudent(startTime, endTime, this.teacherId() ?? undefined));
            this.events.set(slots.map((slot) => this.slotToEvent(slot)));
        } finally {
            this.isLoading = false;
        }
    }

    onDataBound(args: any): void {
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

    onNavigating(args: NavigatingEventArgs): void { }

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
        args.cancel = true;
    }

    // Method to control resize permission
    onResizeStart(args: any): void {
        args.cancel = true;
    }

    onDragStop(args: any): void { }

    onResizeStop(args: any): void { }

    onCellClick(event: CellClickEventArgs) { }

    public onPopupOpen(args: PopupOpenEventArgs): void {
        args.cancel = true;
    }

    clickEvent(event: EventClickArgs) {
        const selectedEvent = event.event as any;
        this.selectedSlot.set(selectedEvent?.ExtendedProps?.slot ?? null);

        if (selectedEvent?.StartTime < new Date() && !this.reservation()) {
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
        if (this.reservation()) {
            this.visibleReservationModal.set(true);
            return;
        }
        this.visibleBookSlotModal.set(true);
    }

    async handleEvent(event: ReservationCreate) {
        try {
            const res = await firstValueFrom(this.slotWrapperService.bookSlot(event));
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Créneau réservé avec succès.' });
            await this.refreshCurrentView();
        } catch (ex) {
            console.log('exception : ', ex);
        } finally {
            this.visibleBookSlotModal.set(false);
        }
    }

    async cancel() {
        this.visibleBookSlotModal.set(false);
        await this.refreshCurrentView();
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

    //  reservations
    async RemoveReservation(reservation: ReservationDetails) {
        try {
            await firstValueFrom(this.slotWrapperService.removeReservationByStudent(reservation.id));
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Réservation annulée avec succès.' });
            await this.refreshCurrentView();
        } catch (ex: any) {
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: ex.error?.message ?? 'Réservation annulée avec succès.' });

            console.log('exception : ', ex);
        }
    }
}

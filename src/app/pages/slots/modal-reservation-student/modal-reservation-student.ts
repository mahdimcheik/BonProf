import { BaseModalComponent } from '@/pages/components/base-modal/base-modal.component';
import { CalendarEvent } from '@/pages/shared/models/calendar-models';
import { Component, computed, inject, model, OnInit, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { ReservationDetails, SlotDetails, StatusReservationCode } from 'src/client';
import { SlotWrapperService } from '@/pages/shared/services/slot-wrapper-service';
import { ConfirmModalComponent } from '@/pages/components/confirm-modal/confirm-modal.component';

@Component({
    selector: 'bp-modal-reservation-student',
    imports: [BaseModalComponent, ButtonModule, AvatarModule, TagModule, DatePipe, ConfirmModalComponent],
    templateUrl: './modal-reservation-student.html'
})
export class ModalReservationStudent implements OnInit {
    visible = model(false);
    title = model('Détails de la réservation');
    event = model.required<CalendarEvent>();
    slot = computed<SlotDetails>(() => this.event()?.ExtendedProps?.['slot'] ?? null);
    reservation = computed(() => this.slot()?.reservation ?? null);

    // Confirmation modal properties
    showConfirmModal = model(false);
    isConfirmModal = signal(false);
    question = computed(() =>
        this.isConfirmModal()
            ? `Êtes-vous sûr de vouloir confirmer la réservation de ${this.reservation()?.student?.user?.firstName} ${this.reservation()?.student?.user?.lastName}`
            : `Êtes-vous sûr de vouloir supprimer la réservation de ${this.reservation()?.student?.user?.firstName} ${this.reservation()?.student?.user?.lastName}`
    );
    titleModal = computed(() => (this.isConfirmModal() ? 'Annuler la réservation' : 'Confirmer la réservation'));

    public pending = StatusReservationCode.Pending;
    public accepted = StatusReservationCode.Accepted;
    public rejected = StatusReservationCode.Rejected;
    public done = StatusReservationCode.Done;

    isPast = computed(() => {
        const slot = this.slot();
        if (!slot?.dateTo) return false;
        return new Date(slot.dateTo) < new Date();
    });

    ngOnInit(): void {}

    removeClicked = output<ReservationDetails>();

    onUpdate() {
        this.isConfirmModal.set(true);
        this.showConfirmModal.set(true);
    }

    onRemove() {
        this.isConfirmModal.set(false);
        this.showConfirmModal.set(true);
    }

    cancel() {
        this.visible.set(false);
    }

    // Confirmation modal actions
    confirm() {
        this.showConfirmModal.set(false);
        this.removeClicked.emit(this.reservation()!);
    }
}

import { BaseModalComponent } from '@/pages/components/base-modal/base-modal.component';
import { CalendarEvent } from '@/pages/shared/models/calendar-models';
import { Component, computed, inject, model, OnInit, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { ReservationDetails, SlotDetails, StatusReservationCode } from 'src/client';
import { SlotWrapperService } from '@/pages/shared/services/slot-wrapper-service';

@Component({
    selector: 'bp-modal-reservation',
    imports: [BaseModalComponent, ButtonModule, AvatarModule, TagModule, DatePipe],
    templateUrl: './modal-reservation.html'
})
export class ModalReservation implements OnInit {
    visible = model(false);
    title = model('Détails de la réservation');
    event = model.required<CalendarEvent>();
    slot = computed<SlotDetails>(() => this.event()?.ExtendedProps?.['slot'] ?? null);
    reservation = computed(() => this.slot()?.reservation ?? null);

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

    updateClicked = output<ReservationDetails | null>();
    removeClicked = output<ReservationDetails>();

    onUpdate() {
        this.updateClicked.emit(this.reservation());
    }

    onRemove() {
        if (!this.reservation()) {
            this.visible.set(false);
            return;
        }
        this.removeClicked.emit(this.reservation()!);
    }

    cancel() {
        this.visible.set(false);
    }
}

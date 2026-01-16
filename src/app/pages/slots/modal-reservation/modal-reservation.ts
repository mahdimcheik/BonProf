import { BaseModalComponent } from '@/pages/components/base-modal/base-modal.component';
import { CalendarEvent } from '@/pages/shared/models/calendar-models';
import { Component, computed, model, OnInit, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { SlotDetails } from 'src/client';

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

    isPast = computed(() => {
        const slot = this.slot();
        if (!slot?.dateTo) return false;
        return new Date(slot.dateTo) < new Date();
    });

    ngOnInit(): void {
        const titi = this.slot();
        const toto = this.reservation();
    }

    updateClicked = output<void>();
    removeClicked = output<void>();

    onUpdate() {
        this.updateClicked.emit();
    }

    onRemove() {
        this.removeClicked.emit();
    }

    cancel() {
        this.visible.set(false);
    }
}

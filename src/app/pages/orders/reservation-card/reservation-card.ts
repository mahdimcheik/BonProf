import { ConfirmModalComponent } from '@/pages/components/confirm-modal/confirm-modal.component';
import { SlotWrapperService } from '@/pages/shared/services/slot-wrapper-service';
import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { firstValueFrom } from 'rxjs';
import { ReservationDetails, StatusReservationCode } from 'src/client';

@Component({
    selector: 'bp-reservation-card',
    imports: [CommonModule, Button, ConfirmModalComponent],
    templateUrl: './reservation-card.html',
    styleUrl: './reservation-card.scss'
})
export class ReservationCard {
    slotService = inject(SlotWrapperService);
    reservation = input.required<ReservationDetails>();
    showEditModal = signal(false);
    showDeleteConfirm = signal(false);
    statusReservationCode = StatusReservationCode;

    onChange = output<void>();

    openEdit() {
        this.showEditModal.set(true);
    }

    closeEdit() {
        this.showEditModal.set(false);
    }

    openDeleteConfirm() {
        this.showDeleteConfirm.set(true);
    }

    closeDeleteConfirm() {
        this.showDeleteConfirm.set(false);
    }

    addReservation() {
        // Logic to add reservation will be implemented
    }
    async removeReservation() {
        if (this.reservation().id) {
            await firstValueFrom(this.slotService.removeReservationByStudent(this.reservation().id));
            this.onChange.emit();
            this.showDeleteConfirm.set(false);
        }
    }
}

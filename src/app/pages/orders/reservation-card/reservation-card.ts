import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { ReservationDetails, StatusReservationCode } from 'src/client';

@Component({
    selector: 'bp-reservation-card',
    imports: [CommonModule, Button],
    templateUrl: './reservation-card.html',
    styleUrl: './reservation-card.scss'
})
export class ReservationCard {
    reservation = input.required<ReservationDetails>();
    showEditModal = signal(false);
    showDeleteConfirm = signal(false);
    statusReservationCode = StatusReservationCode;

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

    deleteReservation() {
        // Logic to delete reservation will be implemented
        this.showDeleteConfirm.set(false);
    }

    addReservation() {
        // Logic to add reservation will be implemented
    }
}

import { ICellRendererAngularComp } from '@/pages/components/smart-grid';
import { ReservationStatusPipe } from '@/pages/shared/pipes/reservation-status-pipe';
import { DatePipe } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { ReservationDetails } from 'src/client';
import { SlotTypePipe } from '../../shared/pipes/slot-type-pipe';
import { Router } from '@angular/router';

@Component({
    selector: 'bp-reservation-card',
    imports: [DatePipe, SlotTypePipe, ReservationStatusPipe],
    templateUrl: './reservation-card.html'
})
export class ReservationCard implements ICellRendererAngularComp {
    router = inject(Router);
    data = model<ReservationDetails | null>(null);
    params = model<any>(null);


    onRowClick() {
        const reservation = this.data();
        if (reservation) {
            this.router.navigate(['/dashboard/teacher/reservations', reservation.id]);
        }
    }
}

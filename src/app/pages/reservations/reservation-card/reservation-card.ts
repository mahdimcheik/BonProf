import { ICellRendererAngularComp } from '@/pages/components/smart-grid';
import { ReservationStatusPipe } from '@/pages/shared/pipes/reservation-status-pipe';
import { DatePipe } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { ReservationDetails } from 'src/client';
import { SlotTypePipe } from '../../shared/pipes/slot-type-pipe';
import { Router } from '@angular/router';
import { MainService } from '@/pages/shared/services/main.service';
import { ButtonModule } from "primeng/button";

@Component({
    selector: 'bp-reservation-card',
    imports: [DatePipe, SlotTypePipe, ReservationStatusPipe, ButtonModule],
    templateUrl: './reservation-card.html'
})
export class ReservationCard implements ICellRendererAngularComp {
    router = inject(Router);
    mainService = inject(MainService);
    data = model<ReservationDetails | null>(null);
    params = model<any>(null);


    onRowClick() {
        const reservation = this.data();
        if (reservation && this.mainService.isStudent()) {
            this.router.navigate(['/dashboard/student/reservations', reservation.id]);
        } else {
            this.router.navigate(['/dashboard/teacher/reservations', reservation?.id]);
        }
    }


}

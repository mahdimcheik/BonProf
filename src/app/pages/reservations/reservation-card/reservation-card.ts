import { ICellRendererAngularComp } from '@/pages/components/smart-grid';
import { ReservationStatusPipe } from '@/pages/shared/pipes/reservation-status-pipe';
import { DatePipe } from '@angular/common';
import { Component, model } from '@angular/core';
import { ReservationDetails } from 'src/client';
import { SlotTypePipe } from '../../shared/pipes/slot-type-pipe';

@Component({
    selector: 'bp-reservation-card',
    imports: [DatePipe, SlotTypePipe, ReservationStatusPipe],
    templateUrl: './reservation-card.html'
})
export class ReservationCard implements ICellRendererAngularComp {
    data = model<ReservationDetails | null>(null);
    params = model<any>(null);
}

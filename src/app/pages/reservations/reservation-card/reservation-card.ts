import { ICellRendererAngularComp } from '@/pages/components/smart-grid';
import { DatePipe } from '@angular/common';
import { Component, model } from '@angular/core';
import { ReservationDetails } from 'src/client';

@Component({
    selector: 'bp-reservation-card',
    imports: [DatePipe],
    templateUrl: './reservation-card.html'
})
export class ReservationCard implements ICellRendererAngularComp {
    data = model<ReservationDetails | null>(null);
    params = model<any>(null);
}

import { Pipe, PipeTransform } from '@angular/core';
import { ReservationStatusEnum } from 'src/client';

@Pipe({
    name: 'reservationStatus'
})
export class ReservationStatusPipe implements PipeTransform {
    transform(value: unknown, ...args: unknown[]): unknown {
        if (!value || typeof value !== 'string') return null;
        if (value == ReservationStatusEnum.Pending) return 'En attente';
        if (value == ReservationStatusEnum.Accepted) return 'Confirmée';
        if (value == ReservationStatusEnum.Rejected) return 'Rejetée';
        if (value == ReservationStatusEnum.Done) return 'finie';
        if (value == ReservationStatusEnum.Cancelled) return 'Annulée';
        return null;
    }
}

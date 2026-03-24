import { Pipe, PipeTransform } from '@angular/core';
import { StatusReservationCode } from 'src/client';

@Pipe({
    name: 'reservationStatus'
})
export class ReservationStatusPipe implements PipeTransform {
    transform(value: string, ...args: unknown[]): unknown {
        if (!value || typeof value !== 'string') return null;
        if (value == StatusReservationCode.Pending) return 'En attente';
        if (value == StatusReservationCode.Accepted) return 'Confirmée';
        if (value == StatusReservationCode.Rejected) return 'Rejetée';
        if (value == StatusReservationCode.Done) return 'finie';
        if (value == StatusReservationCode.Cancelled) return 'Annulée';
        return null;
    }
}

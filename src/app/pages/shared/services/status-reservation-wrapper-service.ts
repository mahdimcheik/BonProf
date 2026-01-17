import { inject, Injectable, signal } from '@angular/core';
import { map, of } from 'rxjs';
import { StatusReservationDetails, StatusReservationsService } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class StatusReservationWrapperService {
    statusReservationService = inject(StatusReservationsService);
    statusReservations = signal<StatusReservationDetails[]>([]);

    getAllStatusReservations(forceRefetch = false) {
        if (this.statusReservations().length > 0 && !forceRefetch) {
            return of(this.statusReservations());
        }
        return this.statusReservationService.statusreservationsAllGet().pipe(
            map((response) => {
                if (response.data) {
                    this.statusReservations.set(response.data);
                }
                return response.data ?? [];
            })
        );
    }
}

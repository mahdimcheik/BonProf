import { CustomTableState, DynamicColDef, INITIAL_STATE } from '@/pages/components/smart-grid';
import { SmartGridModernizedComponent } from '@/pages/components/smart-grid-modernized/smart-grid-modernized.component';
import { SlotWrapperService } from '@/pages/shared/services/slot-wrapper-service';
import { StatusReservationWrapperService } from '@/pages/shared/services/status-reservation-wrapper-service';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ReservationDetails } from 'src/client';
import { ReservationCard } from '../reservation-card/reservation-card';

@Component({
    selector: 'bp-reservations-page-teacher',
    imports: [SmartGridModernizedComponent],
    templateUrl: './reservations-page-teacher.html'
})
export class ReservationsPageTeacher {
    slotService = inject(SlotWrapperService);

    reservationStatusService = inject(StatusReservationWrapperService);

    globalSearch = signal<string>('');
    reservations = signal<ReservationDetails[]>([]);
    tableState = signal<CustomTableState>(INITIAL_STATE);
    totalRecords = signal<number>(0);
    allStatusReservations = this.reservationStatusService.statusReservations;
    renderComponent = ReservationCard;

    columnsDef = computed<DynamicColDef[]>(() => [
        // { field: 'studentName', header: 'Etudiant', type: 'text', filterable: true, filterField: 'studentName' },
        { field: 'studentName', header: 'Etudiant', type: 'text', filterable: true, filterField: 'studentName' },
        {
            field: 'status',
            header: 'Statut',
            type: 'array',
            filterable: true,
            filterField: 'status',
            options: this.allStatusReservations(),
            optionLabel: 'name',
            optionValue: 'id'
        }
    ]);

    constructor() {
        let firstLoad = false;

        effect(() => {
            const query = this.tableState();
            if (firstLoad) {
                firstLoad = false;
                return;
            }
            this.loadData(query);
        });
    }

    async loadData(query: CustomTableState) {
        if (!query.filters) {
            query.filters = {};
        }
        const result = await firstValueFrom(this.slotService.GetReservationsByTeacher(query));
        this.reservations.set(result.data || []);
        this.totalRecords.set(result.count || 0);

        await firstValueFrom(this.reservationStatusService.getAllStatusReservations());
    }
}

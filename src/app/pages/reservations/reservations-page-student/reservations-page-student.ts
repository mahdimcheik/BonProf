import { CustomTableState, DynamicColDef, INITIAL_STATE } from '@/pages/components/smart-grid';
import { SmartGridModernizedComponent } from '@/pages/components/smart-grid-modernized/smart-grid-modernized.component';
import { SlotWrapperService } from '@/pages/shared/services/slot-wrapper-service';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ReservationDetails } from 'src/client';
import { ReservationCard } from '../reservation-card/reservation-card';

@Component({
    selector: 'bp-reservations-page-student',
    imports: [SmartGridModernizedComponent],
    templateUrl: './reservations-page-student.html'
})
export class ReservationsPageStudent {
    slotService = inject(SlotWrapperService);

    globalSearch = signal<string>('');
    reservations = signal<ReservationDetails[]>([]);
    tableState = signal<CustomTableState>(INITIAL_STATE);
    totalRecords = signal<number>(0);
    renderComponent = ReservationCard;

    columnsDef = computed<DynamicColDef[]>(() => [{ field: 'teacherName', header: 'Professeur', type: 'text', filterable: true, filterField: 'teacherName' }]);

    constructor() {
        effect(() => {
            const query = this.tableState();
            this.loadData(query);
        });
    }

    async loadData(query: CustomTableState) {
        if (!query.filters) {
            query.filters = {};
        }
        const result = await firstValueFrom(this.slotService.GetReservationsByStudent(query));
        this.reservations.set(result.data || []);
        this.totalRecords.set(result.count || 0);
    }
}

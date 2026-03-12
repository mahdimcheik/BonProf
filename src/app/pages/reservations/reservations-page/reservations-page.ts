import { DynamicColDef } from '@/pages/components/smart-grid';
import { SmartGridGridifyComponent } from '@/pages/components/smart-grid-gridify/smart-grid-gridify';
import { SlotWrapperService } from '@/pages/shared/services/slot-wrapper-service';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { GridifyQuery } from 'src/client';

@Component({
    selector: 'bp-reservations-page',
    imports: [SmartGridGridifyComponent],
    templateUrl: './reservations-page.html'
})
export class ReservationsPage {
    slotService = inject(SlotWrapperService);

    tableState = signal<GridifyQuery>({ page: 1, pageSize: 10, orderBy: null, filter: null });
    globalSearch = signal<string>('');

    columnsDef = computed<DynamicColDef[]>(() => [
        { field: 'studentName', header: 'First Name', type: 'text', filterable: true, filterField: 'studentName' },
        { field: 'student.user.lastName', header: 'Last Name', type: 'text', filterable: true, filterField: 'student.user.lastName' }
    ]);

    constructor() {
        let firstLoad = true;

        effect(() => {
            const query = this.tableState();
            if (firstLoad) {
                firstLoad = false;
                return;
            }
            this.loadData(query);
        });
    }

    async loadData(query: GridifyQuery) {
        const result = await firstValueFrom(this.slotService.GetReservationsByStudentGrid(query));
        console.log('Loaded reservations:', result);
    }
}

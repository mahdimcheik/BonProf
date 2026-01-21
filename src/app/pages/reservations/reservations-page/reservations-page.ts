import { CustomTableState, DynamicColDef } from '@/pages/components/smart-grid';
import { SlotWrapperService } from '@/pages/shared/services/slot-wrapper-service';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SmartGridModernizedComponent } from '@/pages/components/smart-grid-modernized/smart-grid-modernized.component';
import { SmartGridGridifyComponent } from '@/pages/components/smart-grid-gridify/smart-grid-gridify';
import { GridifyQuery } from 'src/client';

@Component({
    selector: 'bp-reservations-page',
    imports: [SmartGridGridifyComponent],
    templateUrl: './reservations-page.html'
})
export class ReservationsPage {
    slotService = inject(SlotWrapperService);

    tableState = signal<GridifyQuery>({ page: 1, pageSize: 10, orderBy: null, filter: null });

    columnsDef = computed<DynamicColDef[]>(() => [
        { field: 'studentName', header: 'First Name', type: 'text', filterable: true, filterField: 'studentName' },
        { field: 'student.user.lastName', header: 'Last Name', type: 'text', filterable: true, filterField: 'student.user.lastName' }
    ]);

    constructor() {
        effect(() => {
            const query = this.tableState();
            this.loadData(query);
        });
    }

    async loadData(query: GridifyQuery) {
        const result = await firstValueFrom(this.slotService.GetReservationsByStudentGrid(query));
        console.log('Loaded reservations:', result);
    }
}

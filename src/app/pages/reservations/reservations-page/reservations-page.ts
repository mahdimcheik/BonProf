import { CustomTableState, DynamicColDef } from '@/pages/components/smart-grid';
import { SlotWrapperService } from '@/pages/shared/services/slot-wrapper-service';
import { Component, computed, inject, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SmartGridModernizedComponent } from '@/pages/components/smart-grid-modernized/smart-grid-modernized.component';

@Component({
    selector: 'bp-reservations-page',
    imports: [SmartGridModernizedComponent],
    templateUrl: './reservations-page.html'
})
export class ReservationsPage implements OnInit {
    slotService = inject(SlotWrapperService);

    columnsDef = computed<DynamicColDef[]>(() => [
        { field: 'student.user.firstName', header: 'First Name' },
        { field: 'student.user.lastName', header: 'Last Name' },
        { field: 'status.code', header: 'Status' }
    ]);
    ngOnInit(): void {
        this.loadData();
    }
    async loadData() {
        const filters: CustomTableState = {
            first: 0,
            rows: 10,
            sorts: [],
            filters: {
                // title: { value: '', matchMode: 'contains' },
                'status.code': { value: 'Pending', matchMode: 'equals' },
                'student.user.firstName': { value: 'Me', matchMode: 'contains' }
                // fullName: { value: 'Me', matchMode: 'contains', specialFilter: true }
            },
            search: ''
        };
        const data = await firstValueFrom(this.slotService.GetReservationsByStudent(filters));
    }
}

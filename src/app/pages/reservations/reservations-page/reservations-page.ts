import { CustomTableState } from '@/pages/components/smart-grid';
import { SlotWrapperService } from '@/pages/shared/services/slot-wrapper-service';
import { Component, inject, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'bp-reservations-page',
    imports: [],
    templateUrl: './reservations-page.html',
    styleUrl: './reservations-page.scss'
})
export class ReservationsPage implements OnInit {
    slotService = inject(SlotWrapperService);
    ngOnInit(): void {
        this.loadData();
    }
    async loadData() {
        const filters: CustomTableState = {
            first: 0,
            rows: 10,
            sorts: [],
            filters: {},
            search: ''
        };
        const data = await firstValueFrom(this.slotService.GetReservationsByStudent(filters));
    }
}

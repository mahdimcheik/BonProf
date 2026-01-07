import { inject, Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { SlotCreate, SlotsService, SlotUpdate } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class SlotWrapperService {
    slotsService = inject(SlotsService);

    addSlot(slotData: SlotCreate) {
        return this.slotsService.slotsTeacherAddPost(slotData).pipe(
            catchError((res) => {
                console.log('error res : ', res);
                return of();
            }),
            map((response) => response.data)
        );
    }

    updateSlot(slotData: SlotUpdate) {
        return this.slotsService.slotsTeacherUpdatePut(slotData).pipe(
            catchError((res) => {
                console.log('error res : ', res);
                return of();
            }),
            map((response) => response.data)
        );
    }

    getSlotsByTeacher(dateFrom: Date, dateTo: Date) {
        return this.slotsService.slotsTeacherMySlotsPost({ dateFrom, dateTo }).pipe(map((response) => response.data || []));
    }

    removeSlotById(slotId: string) {
        return this.slotsService.slotsTeacherRemoveSlotIdDelete(slotId).pipe(
            catchError((res) => {
                console.log('error res : ', res);
                return of();
            }),
            map((response) => response.data)
        );
    }
}

import { CustomTableState } from '@/pages/components/smart-grid';
import { inject, Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { ReservationCreate, SlotCreate, SlotsService, SlotUpdate, StatusReservationCode } from 'src/client';

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

    getSlotsByStudent(dateFrom: Date, dateTo: Date, teacherId?: string) {
        if (teacherId) {
            return this.slotsService.slotsTeacherTeacherIdAvailableSlotsPost(teacherId, { dateFrom, dateTo }).pipe(map((response) => response.data || []));
        } else {
            return this.slotsService.slotsStudentPost({ dateFrom, dateTo }).pipe(map((response) => response.data || []));
        }
    }

    removeSlotById(slotId: string) {
        return this.slotsService.slotsTeacherRemoveSlotIdDelete(slotId).pipe(map((response) => response.data));
    }

    // reservation
    bookSlot(reservationData: ReservationCreate) {
        return this.slotsService.slotsStudentBookPost(reservationData).pipe(
            catchError((res) => {
                console.log('error res : ', res);
                return of();
            }),
            map((response) => response.data)
        );
    }

    confirmReservation(reservationId: string) {
        return this.slotsService.slotsTeacherConfirmReservationPost({ reservationId, statusCode: StatusReservationCode.Accepted });
    }

    removeReservation(reservationId: string) {
        return this.slotsService.slotsTeacherRemoveReservationDelete(reservationId);
    }

    removeReservationByStudent(reservationId: string) {
        return this.slotsService.slotsStudentRemoveReservationDelete(reservationId);
    }

    GetReservationsByStudent(tableState: CustomTableState) {
        return this.slotsService.slotsStudentReservationsPost(tableState);
    }
    GetReservationsByTeacher(tableState: CustomTableState) {
        return this.slotsService.slotsTeacherReservationsPost(tableState);
    }
    GetReservationById(reservationId: string) {
        return this.slotsService.slotsReservationReservationIdGet(reservationId).pipe(map((response) => response.data)) ;
    }
}

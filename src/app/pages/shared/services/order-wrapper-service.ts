import { CustomTableState } from '@/pages/components/smart-grid';
import { inject, Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { OrderService } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class OrderWrapperService {
    orderService = inject(OrderService);

    getTeacherOrders(tableState: CustomTableState) {
        return this.orderService.orderTeacherOrdersPost(tableState).pipe(
            catchError((res) => {
                console.log('error res : ', res);
                return of();
            }),
            map((response) => response.data || [])
        );
    }

    getStudentOrders(tableState: CustomTableState) {
        return this.orderService.orderStudentOrdersPost(tableState).pipe(
            catchError((res) => {
                console.log('error res : ', res);
                return of();
            }),
            map((response) => response.data || [])
        );
    }

    getActiveOrder() {
        return this.orderService.orderStudentActiveOrderGet().pipe(
            catchError((res) => {
                console.log('error res : ', res);
                return of();
            }),
            map((response) => response.data)
        );
    }
}

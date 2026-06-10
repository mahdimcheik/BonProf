import { CustomTableState } from '@/pages/components/smart-grid';
import { inject, Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { OrderService, PaymentService } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class OrderWrapperService {
    orderService = inject(OrderService);
    paymentService = inject(PaymentService);

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

    createCheckoutSession(orderId: string) {
        return this.paymentService.paymentCheckoutPost({ orderId: orderId, currency: 'eur' }).pipe(
            catchError((res) => {
                console.log('error res : ', res);
                return of();
            }),
            map((response) => response.data)
        );
    }
}

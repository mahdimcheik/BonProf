import { inject, Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { CreateAccountRequest, PaymentService } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class PaymentWrapperService {
    paymentService = inject(PaymentService);

    createCheckoutSession(orderId: string) {
        return this.paymentService.paymentCheckoutPost({ orderId: orderId, currency: 'eur' }).pipe(
            catchError((res) => {
                console.log('error res : ', res);
                return of();
            }),
            map((response) => response.data)
        );
    }

    CreateConnectedAccountAsync(createAccountRequest: CreateAccountRequest) {
        return this.paymentService.paymentConnectAccountPost(createAccountRequest).pipe(
            catchError((res) => {
                console.log('error res : ', res);
                return of();
            }),
            map((response) => response.data)
        );
    }
}

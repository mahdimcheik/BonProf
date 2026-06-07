import { OrderWrapperService } from '@/pages/shared/services/order-wrapper-service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { firstValueFrom } from 'rxjs';
import { OrderDetails, StatusReservationCode } from 'src/client';
import { ReservationCard } from '../reservation-card/reservation-card';

@Component({
    selector: 'bp-order-active',
    imports: [CommonModule, Button, Card, Divider, ReservationCard],
    templateUrl: './order-active.html',
    styleUrl: './order-active.scss'
})
export class OrderActive implements OnInit {
    orderService = inject(OrderWrapperService);
    order = signal<OrderDetails>({} as OrderDetails);
    showPaymentModal = signal(false);
    statusReservationCode = StatusReservationCode;

    ngOnInit(): void {
        this.loadActiveOrder();
    }

    async loadActiveOrder() {
        const orderDetails = await firstValueFrom(this.orderService.getActiveOrder());
        if (orderDetails) {
            this.order.set(orderDetails);
            console.log('Active order details : ', this.order());
        }
    }

    openPayment() {
        this.showPaymentModal.set(true);
    }

    goBack() {
        // Logic to go back will be implemented
    }
}

import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { ReservationCard } from '../reservation-card/reservation-card';
import { OrderDetails, StatusReservationCode } from 'src/client';
import { OrderWrapperService } from '@/pages/shared/services/order-wrapper-service';
import { first, firstValueFrom } from 'rxjs';

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
        throw new Error('Method not implemented.');
    }

    async loadActiveOrder() {
        const orderDetails = await firstValueFrom(this.orderService.getActiveOrder());
        if (orderDetails) {
            this.order.set(orderDetails);
        }
    }

    openPayment() {
        this.showPaymentModal.set(true);
    }

    goBack() {
        // Logic to go back will be implemented
    }
}

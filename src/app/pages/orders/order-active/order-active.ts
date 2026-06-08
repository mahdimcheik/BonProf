import { Countdown } from '@/pages/components/countdown/countdown';
import { OrderWrapperService } from '@/pages/shared/services/order-wrapper-service';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { firstValueFrom } from 'rxjs';
import { OrderDetails, StatusReservationCode } from 'src/client';
import { ReservationCard } from '../reservation-card/reservation-card';

@Component({
    selector: 'bp-order-active',
    imports: [CommonModule, Button, CardModule, Divider, ReservationCard, Countdown],
    templateUrl: './order-active.html',
    styleUrl: './order-active.scss'
})
export class OrderActive implements OnInit {
    orderService = inject(OrderWrapperService);
    order = signal<OrderDetails>({} as OrderDetails);
    totalPrice = computed(() => this.order().totalAmount);
    showPaymentModal = signal(false);
    statusReservationCode = StatusReservationCode;
    leftTime = signal<number>(0);

    ngOnInit(): void {
        this.loadActiveOrder();
    }

    async loadActiveOrder() {
        const orderDetails = await firstValueFrom(this.orderService.getActiveOrder());
        if (orderDetails) {
            this.order.set(orderDetails);
            console.log('Active order details : ', this.order().updatedAt);
            if (this.order().updatedAt) {
                const currentTime = new Date().getTime();
                const orderUpdateTime = new Date(this.order().updatedAt!).getTime();
                const elapsedTimeInSeconds = (currentTime - orderUpdateTime) / 1000;
                const remainingTimeInSeconds = 900 - elapsedTimeInSeconds;
                this.leftTime.set(remainingTimeInSeconds);
            }
        }
    }
    reload() {
        this.loadActiveOrder();
    }

    openPayment() {
        this.showPaymentModal.set(true);
    }

    goBack() {
        // Logic to go back will be implemented
        window.history.back();
    }
}

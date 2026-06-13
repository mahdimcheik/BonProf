import { LogoComponent } from '@/pages/components/logo/logo.component';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'bp-payment-canceled',
    imports: [LogoComponent, ButtonModule, RouterModule],
    templateUrl: './payment-canceled.html',
    styleUrl: './payment-canceled.scss'
})
export class PaymentCanceled {}

import { LogoComponent } from '@/pages/components/logo/logo.component';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'bp-payment-success',
    imports: [LogoComponent, ButtonModule, RouterModule],
    templateUrl: './payment-success.html',
    styleUrl: './payment-success.scss'
})
export class PaymentSuccess {}

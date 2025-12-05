import { LayoutService } from '@/layout/service/layout.service';
import { MainService } from '@/pages/shared/services/main.service';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'bp-logo',
    imports: [],
    templateUrl: './logo.component.html'
})
export class LogoComponent {
    layoutService = inject(LayoutService);
    mainService = inject(MainService);
    router = inject(Router);
    width = input<number>(100);
    goToHome() {
        this.router.navigate(['/']);
    }
}

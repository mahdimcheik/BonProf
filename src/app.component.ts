import { OverlaySpinner } from '@/pages/components/overlay-spinner/overlay-spinner';
import { MainService } from '@/pages/shared/services/main.service';
import { SignalRService } from '@/pages/shared/services/signal-r-service';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Toast } from 'primeng/toast';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, Toast, OverlaySpinner],
    template: ` <bp-overlay-spinner></bp-overlay-spinner>
        <p-toast position="top-center"> </p-toast><router-outlet> </router-outlet>`
})
export class AppComponent implements OnInit {
    signalRService = inject(SignalRService);
    mainService = inject(MainService);

    ngOnInit(): void {
        if (this.mainService.token()) {
            this.signalRService.initiateAndConnect(this.mainService.token());
        }
    }
}

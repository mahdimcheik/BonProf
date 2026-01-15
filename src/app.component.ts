import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Toast } from 'primeng/toast';
import { OverlaySpinner } from '@/pages/components/overlay-spinner/overlay-spinner';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, Toast, OverlaySpinner],
    template: ` <bp-overlay-spinner></bp-overlay-spinner>
        <p-toast position="top-center"> </p-toast><router-outlet> </router-outlet>`
})
export class AppComponent {}

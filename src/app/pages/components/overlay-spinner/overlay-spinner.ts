import { LoaderService } from '@/pages/shared/services/loader.service';
import { Component, inject } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'bp-overlay-spinner',
    imports: [ProgressSpinnerModule],
    templateUrl: './overlay-spinner.html',
    styleUrl: './overlay-spinner.scss'
})
export class OverlaySpinner {
    loaderService = inject(LoaderService);
    isFetching = this.loaderService.isLoading;
}

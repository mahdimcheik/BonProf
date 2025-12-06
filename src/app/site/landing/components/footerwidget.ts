import { MainService } from '@/pages/shared/services/main.service';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'footer-widget',
    imports: [RouterModule],
    template: `
        <div class="flex flex-row gap-4 justify-center items-center h-[90px] bg-surface-0 dark:bg-surface-900">
            <div class="px-6 md:px-12">
                <a (click)="router.navigate(['/pages/landing'], { fragment: 'home' })" class="flex flex-wrap gap-2 items-center justify-center md:justify-start md:mb-0 mb-6 cursor-pointer">
                    <img [src]="mainService.logoUrl" alt="" width="50" height="50" />
                    <h4 class="font-medium text-3xl text-surface-900 dark:text-surface-0">{{ mainService.ApplicationName }}</h4>
                </a>
            </div>

            <div class="flex flex-row  gap-4 items-center  ">
                <p class="text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Discord</p>
                <p class="text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Politique de confidentialité</p>
            </div>
        </div>
    `
})
export class FooterWidget {
    router = inject(Router);
    mainService = inject(MainService);
}

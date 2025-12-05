import { MainService } from '@/pages/shared/services/main.service';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'footer-widget',
    imports: [RouterModule],
    template: `
        <div class="py-4 px-4 mx-0 mt-2 lg:mx-20">
            <div class="flex flex-col md:flex-row gap-4 items-center">
                <div class="w-full md:w-1/3 ">
                    <a (click)="router.navigate(['/pages/landing'], { fragment: 'home' })" class="flex flex-wrap gap-2 items-center justify-center md:justify-start md:mb-0 mb-6 cursor-pointer">
                        <img [src]="mainService.logoUrl" alt="" width="50" height="50" />
                        <h4 class="font-medium text-3xl text-surface-900 dark:text-surface-0">{{ mainService.ApplicationName }}</h4>
                    </a>
                </div>

                <div class="flex flex-col gap-2 md:flex-row md:gap-8 text-center md:text-left items-center md:items-start ">
                    <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Discord</a>
                    <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">FAQ</a>
                    <a class="leading-normal text-xl block cursor-pointer mb-2 text-surface-700 dark:text-surface-100">Politique de confidentialité</a>
                </div>
            </div>
        </div>
    `
})
export class FooterWidget {
    router = inject(Router);
    mainService = inject(MainService);
}

import { MainService } from '@/pages/shared/services/main.service';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        <a [routerLink]="['/']" fragment="home" class="flex flex-wrap gap-2 items-center justify-center md:justify-start md:mb-0 mb-6 cursor-pointer">
            <img [src]="mainService.logoUrl" alt="" width="25" height="25" />
            <p class="text-md font-semibold text-surface-900 dark:text-surface-0 hidden md:block">{{ mainService.ApplicationName }}</p>
        </a>
    </div>`,
    imports: [RouterLink]
})
export class AppFooter {
    mainService = inject(MainService);
}

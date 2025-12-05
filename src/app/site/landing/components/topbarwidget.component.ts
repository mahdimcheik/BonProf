import { AppFloatingConfigurator } from '@/layout/component/app.floatingconfigurator';
import { LayoutService } from '@/layout/service/layout.service';
import { MainService } from '@/pages/shared/services/main.service';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
    selector: 'topbar-widget',
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, AppFloatingConfigurator, OverlayBadgeModule, AvatarModule],
    template: `<a class="flex items-center" href="#">
            <img src="assets/bird.svg" alt="SAKAI Logo" class="mr-3" width="40" height="40" />

            <span class="text-surface-900 dark:text-surface-0 font-medium text-2xl leading-normal mr-20">{{ mainService.ApplicationName }}</span>
        </a>

        <a pButton [text]="true" severity="secondary" [rounded]="true" pRipple class="lg:hidden!" pStyleClass="@next" enterFromClass="hidden" leaveToClass="hidden" [hideOnOutsideClick]="true">
            <i class="pi pi-bars text-2xl!"></i>
        </a>

        <div class="items-center bg-surface-0 dark:bg-surface-900 grow justify-between hidden lg:flex absolute lg:static w-full left-0 top-full px-12 lg:px-0 z-20 rounded-border">
            <ul class="list-none p-0 m-0 flex lg:items-center select-none flex-col lg:flex-row cursor-pointer gap-8">
                @for (link of mainService.mainTopbarLinks(); track link.label) {
                    <li>
                        <a (click)="router.navigate([link.routerLink])" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                            <span>{{ link.label }}</span>
                        </a>
                    </li>
                }
            </ul>
            <div class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-3">
                <p-button type="button" (onClick)="toggleDarkMode()" [rounded]="true" [icon]="isDarkTheme() ? 'pi pi-moon' : 'pi pi-sun'" severity="secondary" />

                @if (mainService.mainTopbarSecondaryLinks().length > 0 && !mainService.userConnected().email) {
                    @for (link of mainService.mainTopbarSecondaryLinks(); track link.label) {
                        <button pButton pRipple [label]="link.label ?? ''" [routerLink]="link.routerLink" [text]="true"></button>
                    }
                } @else {
                    <p-overlaybadge [value]="notioficationsFormatted()">
                        <i class="pi pi-bell" style="font-size: 2rem"></i>
                    </p-overlaybadge>
                    <p-avatar [image]="(mainService.userConnected().imgUrl ?? !isDarkTheme()) ? 'assets/user.svg' : 'assets/user-dark.svg'" size="normal" class="ml-2" shape="circle" [style]="{ width: '35px', height: '35px' }" />
                }
            </div>
        </div> `
})
export class TopbarWidget {
    router = inject(Router);
    mainService = inject(MainService);
    layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);
    notificationsNumber = signal(3);
    notioficationsFormatted = computed(() => {
        const num = this.notificationsNumber();
        return num > 9 ? '9+' : num.toString();
    });

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}

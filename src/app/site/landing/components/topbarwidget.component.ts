import { LayoutService } from '@/layout/service/layout.service';
import { MainService } from '@/pages/shared/services/main.service';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { Menu } from 'primeng/menu';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
    selector: 'topbar-widget',
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, OverlayBadgeModule, AvatarModule, DrawerModule, DividerModule, Menu],
    template: `<a class="flex items-center" href="#">
            <img src="assets/bird.svg" alt="SAKAI Logo" class="mr-3" width="40" height="40" />

            <span class="text-surface-900 dark:text-surface-0 font-medium text-2xl leading-normal mr-20">{{ mainService.ApplicationName }}</span>
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
            <div class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-1">
                <p-button type="button" (onClick)="toggleDarkMode()" [rounded]="true" [icon]="isDarkTheme() ? 'pi pi-moon' : 'pi pi-sun'" severity="secondary" />
                <p-menu #menu [model]="authItems()" [popup]="true" />
                <p-avatar (click)="menu.toggle($event)" [image]="(userConnected()?.imgUrl ?? !isDarkTheme()) ? 'assets/user.svg' : 'assets/user-dark.svg'" size="normal" shape="circle" [style]="{ width: '35px', height: '35px' }" />
            </div>
        </div>
        @if (!mobileMenuVisible()) {
            <a pButton [text]="true" severity="secondary" [rounded]="true" pRipple class="lg:hidden!" (click)="toggleMenu()">
                <i class="pi pi-bars text-2xl!"></i>
            </a>
        } @else {
            <p-drawer [(visible)]="mobileMenuVisible" position="left" [baseZIndex]="1000" styleClass="!w-full md:!w-100 lg:!w-[50rem] md:!mb-0 lg:!mb-0">
                <ul class="list-none p-0 m-0 flex select-none flex-col cursor-pointer gap-8 w-full justify-center items-center h-full">
                    @for (item of mainItems(); track $index) {
                        <li>
                            <a [routerLink]="item.routerLink" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl menu-link" routerLinkActive="active-route" [routerLinkActiveOptions]="{ exact: false }">
                                <span class="layout-menuitem-text">{{ item.label }}</span>
                            </a>
                        </li>
                    }
                    <p-divider layout="horizontal" type="solid" [style]="{ width: '100%' }"></p-divider>
                    <p-button type="button" (onClick)="toggleDarkMode()" [rounded]="true" [icon]="isDarkTheme() ? 'pi pi-moon' : 'pi pi-sun'" severity="secondary" />
                    @if (mainService.userConnected()?.email) {
                        <li>
                            <p-avatar [image]="(mainService.userConnected()?.imgUrl ?? !isDarkTheme()) ? 'assets/user.svg' : 'assets/user-dark.svg'" size="normal" shape="circle" [style]="{ width: '35px', height: '35px' }" />
                        </li>
                    }
                    @for (item of authItems(); track $index) {
                        <li>
                            <a
                                [routerLink]="item.routerLink ?? ''"
                                (click)="excuteCommand(item); mobileMenuVisible.set(false)"
                                pRipple
                                class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl menu-link"
                                routerLinkActive="active-route"
                                [routerLinkActiveOptions]="{ exact: false }"
                            >
                                <span class="layout-menuitem-text">{{ item.label }}</span>
                            </a>
                        </li>
                    }
                </ul>
            </p-drawer>
        }`
})
export class TopbarWidget {
    router = inject(Router);
    mainService = inject(MainService);
    layoutService = inject(LayoutService);
    mobileMenuVisible = signal(false);
    mainItems = this.mainService.mainTopbarLinks;
    authItems = this.mainService.mainTopbarSecondaryLinks;
    userConnected = this.mainService.userConnected;
    profile = computed(() => this.userConnected()?.profile);

    isDarkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);
    notificationsNumber = signal(3);
    notioficationsFormatted = computed(() => {
        const num = this.notificationsNumber();
        return num > 9 ? '9+' : num.toString();
    });

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    excuteCommand(item: any) {
        if (item.command) {
            item.command(item);
        }
    }

    toggleMenu() {
        this.mobileMenuVisible.set(true);
    }
}

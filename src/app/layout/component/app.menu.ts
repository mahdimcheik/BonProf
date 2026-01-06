import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { MainService } from '@/pages/shared/services/main.service';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule, Button],
    template: `
        <div class="flex flex-col h-[calc(100dvh-140px)] justify-between">
            <ul class="layout-menu">
                @for (item of model(); track item.label; let i = $index) {
                    @if (!item.separator) {
                        <li app-menuitem [item]="item" [index]="i" [root]="true"></li>
                    } @else {
                        <li class="menu-separator"></li>
                    }
                }
            </ul>
            <div class="menu-separator">
                <p-button variant="text" label="Déconnexion" icon="pi pi-fw pi-power-off" routerLink="/logout"></p-button>
            </div>
        </div>
    `
})
export class AppMenu {
    mainService = inject(MainService);

    model = this.mainService.sidebarMenuItems;
}

import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { MainService } from '@/pages/shared/services/main.service';
import { Button } from 'primeng/button';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule, Button],
    template: `
        <div class="flex flex-col  justify-between" [style.height]="height">
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
export class AppMenu implements OnInit {
    mainService = inject(MainService);
    breakpointObserver = inject(BreakpointObserver);
    destroyRef = inject(DestroyRef);
    height = (window.innerHeight - 130).toString() + 'px';

    model = this.mainService.sidebarMenuItems;

    ngOnInit(): void {
        this.breakpointObserver
            .observe(['(max-width: 991px)'])
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                this.height = result.matches ? (window.innerHeight - 20).toString() + 'px' : (window.innerHeight - 130).toString() + 'px';
            });
    }
}

import { Component, DestroyRef, ElementRef, inject } from '@angular/core';
import { MainService } from '@/pages/shared/services/main.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Button } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule, Button],
    template: ` <div class="layout-sidebar">
        <div class="flex flex-col  justify-between" [style.height]="height">
            <ul class="layout-menu">
                @for (item of model(); track item.label; let i = $index) {
                    @if (!item.separator) {
                        @if (item['root']) {
                            <li class="layout-menuitem-root-text mb-2">{{ item.label }}</li>
                        } @else {
                            <li routerLinkActive="active-link" [routerLinkActiveOptions]="{ exact: true, matrixParams: 'subset', queryParams: 'subset' }">
                                <p-button variant="text" severity="primary" [label]="item.label" [icon]="item.icon" [routerLink]="item.routerLink"></p-button>
                            </li>
                        }
                    } @else {
                        <li class="menu-separator"></li>
                    }
                }
            </ul>
            <div class="menu-separator">
                <p-button variant="text" severity="info" label="Paramètres" icon="pi pi-fw pi-cog" routerLink="/dashboard/settings"></p-button>
                <p-button variant="text" severity="danger" label="Déconnexion" icon="pi pi-fw pi-power-off" routerLink="/logout"></p-button>
            </div>
        </div>
    </div>`
})
export class AppSidebar {
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
        window.addEventListener('resize', () => {
            this.height = this.breakpointObserver.isMatched('(max-width: 991px)') ? (window.innerHeight - 20).toString() + 'px' : (window.innerHeight - 130).toString() + 'px';
        });
    }
}

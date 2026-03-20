import { NotificationsWrapperService } from '@/pages/shared/services/notification-service';
import { CommonModule } from '@angular/common';
import { Component, effect, inject, linkedSignal, model, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StyleClassModule } from 'primeng/styleclass';
import { firstValueFrom } from 'rxjs';
import { FilterNotification } from 'src/client/models';
import { LayoutService } from '../service/layout.service';

@Component({
    selector: 'bp-notifications-menu',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, DrawerModule, RadioButtonModule, FormsModule],
    template: ` <div class="relative z-50 flex items-center h-full">
        <button class="flex items-center" (click)="visible.set(!visible())"><i class="pi pi-bell"></i></button>
        <p-drawer [(visible)]="visible" position="right" closable="true" [styleClass]="'!w-full md:!w-[50vw]'">
            <div class="flex flex-wrap gap-4">
                <div class="flex items-center">
                    <p-radiobutton name="pizza" [value]="undefined" [(ngModel)]="seen" inputId="isUndefined" />
                    <label for="isUndefined" class="ml-2">Toutes</label>
                </div>
                <div class="flex items-center">
                    <p-radiobutton name="pizza" [value]="true" [(ngModel)]="seen" inputId="isSeen" />
                    <label for="isSeen" class="ml-2">Lues</label>
                </div>

                <div class="flex items-center">
                    <p-radiobutton name="pizza" [value]="false" [(ngModel)]="seen" inputId="isNotSeen" />
                    <label for="isNotSeen" class="ml-2">Non lues</label>
                </div>
            </div>
            <div class="flex flex-col h-[calc(100vh-150px)] mt-4 overflow-auto">
                @for (notif of notifications(); track notif.id) {
                    <div class="flex flex-col gap-2 mb-4 p-3 rounded-border" [ngClass]="{ 'bg-surface-200': !notif.isSeen, 'bg-transparent': notif.isSeen }">
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-2">
                                <div class="text-sm font-medium text-surface-900 dark:text-surface-0">{{ notif.name }}</div>
                                <div class="text-xs text-surface-600 dark:text-surface-400">{{ notif.createdAt | date: 'short' }}</div>
                            </div>
                            <div class="text-sm text-surface-700 dark:text-surface-300">{{ notif.message }}</div>
                        </div>
                    </div>
                } @empty {
                    <div class=" min-h-[200px] flex items-center justify-center">
                        <p>aucune notification</p>
                    </div>
                }
            </div>
        </p-drawer>
    </div>`
})
export class NotificationsMenu {
    notificationService = inject(NotificationsWrapperService);
    layoutService = inject(LayoutService);
    visible = model(false);
    items!: MenuItem[];
    notifications = this.notificationService.notifications;
    seen = signal<boolean | undefined>(undefined);
    filter = linkedSignal(() => {
        const seenValue = this.seen();
        if (seenValue === undefined) {
            return { first: 0, row: 10 };
        } else {
            return { isSeen: seenValue, first: 0, row: 10 };
        }
    });

    constructor() {
        effect(() => {
            const seenValue = this.seen();
            untracked(() => {
                this.laodNotifications(this.filter());
            });
        });
    }

    async laodNotifications(filter: FilterNotification) {
        await firstValueFrom(this.notificationService.getNotifications(filter));
    }
}

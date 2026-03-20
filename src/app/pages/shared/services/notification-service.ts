import { inject, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { FilterNotification, NotificationsService } from 'src/client';
import { StoreService } from './store-service';

@Injectable({
    providedIn: 'root'
})
export class NotificationsWrapperService {
    notificationService = inject(NotificationsService);
    storeService = inject(StoreService);
    notifications = this.storeService.Notifications;

    getNotifications(filter: FilterNotification) {
        return this.notificationService.notificationsPost(filter).pipe(
            map((response) => response.data),
            tap((notifications) => this.notifications.set(notifications ?? []))
        );
    }

    toggleSeen(id: string) {
        return this.notificationService.notificationsIdToggleSeenPut(id).pipe(map((response) => response.data));
    }
}

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
    notifications = this.storeService.notifications;
    notficationCount = this.storeService.notficationCount;

    getNotifications(filter: FilterNotification) {
        return this.notificationService.notificationsPost(filter).pipe(
            tap((response) => {
                this.notifications.set(response.data ?? []);
                this.notficationCount.set(response.count ?? 0);
            })
        );
    }

    toggleSeen(id: string) {
        return this.notificationService.notificationsIdToggleSeenPut(id).pipe(map((response) => response.data));
    }

    toggleSeenAll() {
        return this.notificationService.notificationsAllToggleSeenPut().pipe(tap(() => this.notficationCount.set(0)));
    }
}

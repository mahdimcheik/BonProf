import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { FilterNotification, NotificationsService } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class NotificationsWrapperService {
    notificationService = inject(NotificationsService);

    getNotifications(filter: FilterNotification) {
        return this.notificationService.notificationsPost(filter).pipe(map((response) => response.data));
    }

    toggleSeen(id: string) {
        return this.notificationService.notificationsIdToggleSeenPut(id).pipe(map((response) => response.data));
    }
}

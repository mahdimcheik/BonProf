import { Injectable, signal } from '@angular/core';
import { NotificationDetails } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    // signal R
    notificationAlert = signal<any>(null);
    messageAlert = signal<any>(null);
    chatAlert = signal<any>(null);
    pingAlert = signal<any>(null);

    // notifications
    notifications = signal<NotificationDetails[]>([]);
    notficationCount = signal<number>(0);
}

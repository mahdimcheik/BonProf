import { Injectable, signal } from '@angular/core';
import { NotificationDetails } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    // signal R
    Notification = signal<any>(null);
    Message = signal<any>(null);
    Chat = signal<any>(null);
    Ping = signal<any>(null);

    // notifications
    Notifications = signal<NotificationDetails[]>([]);
}

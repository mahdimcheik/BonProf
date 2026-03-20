import { inject, Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { MessageService } from 'primeng/api';
import { NotificationTypeEnum, RoleDetails, RoleEnum } from 'src/client';
import { environment } from 'src/environments/environment';
import { StoreService } from './store-service';

export enum ConnectionState {
    Connected = 'Connected',
    Disconnected = 'Disconnected',
    Reconnecting = 'Reconnecting',
    Error = 'Error'
}

@Injectable({ providedIn: 'root' })
export class SignalRService {
    private messageService = inject(MessageService);
    private storeService = inject(StoreService);
    private hubConnection!: signalR.HubConnection;
    private connectionState = signal<ConnectionState>(ConnectionState.Disconnected);
    baseUrl = environment.API_URL;

    private pingInterval: any;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private isIntentionalDisconnect = false;

    constructor() {}

    async initiateAndConnect(token: string) {
        if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
            return;
        }
        this.isIntentionalDisconnect = false;
        this.createConnection(token);
        await this.startConnection();
        this.registerEventHandlers();
    }

    async addToAppropriateGroup(roles: RoleDetails[]) {
        if (roles.some((role) => role.name === RoleEnum.SuperAdmin)) {
            await this.addToGroup(RoleEnum.SuperAdmin);
        }
        if (roles.some((role) => role.name === RoleEnum.Admin || role.name === RoleEnum.SuperAdmin)) {
            await this.addToGroup(RoleEnum.Admin);
        }
        if (roles.some((role) => role.name === RoleEnum.Admin)) {
            await this.addToGroup(RoleEnum.Admin);
        }
        if (roles.some((role) => role.name === RoleEnum.Student)) {
            await this.addToGroup(RoleEnum.Student);
        }
        if (roles.some((role) => role.name === RoleEnum.Teacher)) {
            await this.addToGroup(RoleEnum.Teacher);
        }
    }

    async removeFromAppropriateGroup(roles: RoleDetails[]) {
        if (roles.some((role) => role.name === RoleEnum.SuperAdmin)) {
            await this.removeFromGroup(RoleEnum.SuperAdmin);
        }
        if (roles.some((role) => role.name === RoleEnum.Admin || role.name === RoleEnum.SuperAdmin)) {
            await this.removeFromGroup(RoleEnum.Admin);
        }
        if (roles.some((role) => role.name === RoleEnum.Admin)) {
            await this.removeFromGroup(RoleEnum.Admin);
        }
        if (roles.some((role) => role.name === RoleEnum.Student)) {
            await this.removeFromGroup(RoleEnum.Student);
        }
        if (roles.some((role) => role.name === RoleEnum.Teacher)) {
            await this.removeFromGroup(RoleEnum.Teacher);
        }
    }

    private createConnection(token: string) {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${this.baseUrl}/chathub`, {
                accessTokenFactory: () => token
                // transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect({
                nextRetryDelayInMilliseconds: (retryContext) => {
                    // Custom retry delays: 0, 2s, 10s, 30s, then stop
                    const delays = [0, 2000, 10000, 30000];
                    return delays[retryContext.previousRetryCount] || null;
                }
            })
            .configureLogging(signalR.LogLevel.Warning) // ou information
            .build();
    }

    private async startConnection() {
        try {
            await this.hubConnection.start();
            this.connectionState.set(ConnectionState.Connected);
            this.reconnectAttempts = 0;
            this.startHeartbeat();
        } catch (error) {
            this.connectionState.set(ConnectionState.Error);
            this.scheduleReconnect();
        }
    }

    private registerEventHandlers() {
        // Connection state events
        this.hubConnection.onclose(() => {
            this.connectionState.set(ConnectionState.Disconnected);
            this.stopHeartbeat();
            // Only reconnect if disconnection was not intentional
            if (!this.isIntentionalDisconnect) {
                this.scheduleReconnect();
            }
            this.isIntentionalDisconnect = false;
        });

        this.hubConnection.onreconnecting(() => {
            this.connectionState.set(ConnectionState.Reconnecting);
        });

        this.hubConnection.onreconnected(() => {
            this.connectionState.set(ConnectionState.Connected);
            this.reconnectAttempts = 0;
            this.startHeartbeat();
        });

        // Message handlers
        this.hubConnection.on(NotificationTypeEnum.Message, (message) => {});

        this.hubConnection.on(NotificationTypeEnum.Notification, (notification) => {
            this.storeService.Notification.set(notification);
        });

        this.hubConnection.on(NotificationTypeEnum.Chat, (chat) => {});

        this.hubConnection.on(NotificationTypeEnum.Ping, () => {
            this.storeService.Ping.set({ message: 'Ping received' });
        });
    }

    private startHeartbeat() {
        this.stopHeartbeat();
        this.pingInterval = setInterval(async () => {
            try {
                if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
                    await this.hubConnection.invoke('GetOnlineCount');
                }
            } catch (error) {
                this.handleConnectionError();
            }
        }, 30000);
    }

    private stopHeartbeat() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }

    private scheduleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            const delay = Math.pow(2, this.reconnectAttempts) * 1000;
            this.reconnectAttempts++;

            setTimeout(() => {
                this.startConnection();
            }, delay);
        } else {
            this.connectionState.set(ConnectionState.Error);
        }
    }

    private handleConnectionError() {
        if (this.hubConnection.state !== signalR.HubConnectionState.Disconnected) {
            this.hubConnection.stop();
        }
    }

    async stopConnection() {
        try {
            this.isIntentionalDisconnect = true;
            await this.hubConnection?.stop();
            this.connectionState.set(ConnectionState.Disconnected);
            this.stopHeartbeat();
        } catch (error) {
            console.error('Failed to stop connection:', error);
            this.isIntentionalDisconnect = false;
        }
    }

    async sendMessage(recipientEmail: string, type: NotificationTypeEnum, message: any) {
        try {
            if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
                await this.hubConnection.invoke('SendMessageByUserEmail', recipientEmail, type, message);
            } else {
                throw new Error('Not connected to server');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        }
    }

    async sendMessageToAll(type: string, message: any) {
        try {
            if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
                await this.hubConnection.invoke('SendMessageToAll', type, message);
            } else {
                throw new Error('Not connected to server');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        }
    }

    async getOnlineCount(): Promise<number> {
        try {
            return await this.hubConnection.invoke('GetOnlineCount');
        } catch (error) {
            console.error('Failed to get online count:', error);
            return 0;
        }
    }
    getConnectionId(): string | null {
        return this.hubConnection?.connectionId || null;
    }

    addToGroup(groupName: string) {
        return this.hubConnection
            .invoke('AddToGroup', groupName)
            .then(() => {})
            .catch((error) => {
                console.error(`Failed to add to group ${groupName}:`, error);
            });
    }

    async removeFromGroup(groupName: string) {
        return await this.hubConnection.invoke('RemoveFromGroup', groupName);
    }
}

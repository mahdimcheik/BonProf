import { computed, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MainService {
    router = inject(Router);
    messageService = inject(MessageService);

    ApplicationName = 'BonProf';
    logoUrl = 'assets/bird.svg';
    baseUrl = environment.API_URL;
    token = signal<string>('');

    // pour la page profile
    userConnected = signal({} as any);

    isAdmin = computed(() => this.userConnected()?.roles?.some((role: any) => role.name === 'Admin'));
    isSuperAdmin = computed(() => this.userConnected()?.roles?.some((role: any) => role.name === 'SuperAdmin'));
    isTeacher = computed(() => this.userConnected()?.roles?.some((role: any) => role.name === 'Teacher'));
    isStudent = computed(() => this.userConnected()?.roles?.some((role: any) => role.name === 'Student'));

    mainTopbarLinks = linkedSignal<MenuItem[]>(() => {
        return [
            { label: 'Accueil', routerLink: '/' },
            { label: 'Documentation', routerLink: '/documentation' },
            { label: 'Mentions Légales', routerLink: '/mentions-legales' }
        ] as MenuItem[];
    });

    mainTopbarSecondaryLinks = linkedSignal<MenuItem[]>(() => {
        return [
            { label: 'Connexion', routerLink: '/auth/login' },
            { label: 'Inscription', routerLink: '/auth/register' }
        ] as MenuItem[];
    });

    // méthode pour rafraîchir le token
    refreshToken() {
        return of();
    }
    reset() {}
}

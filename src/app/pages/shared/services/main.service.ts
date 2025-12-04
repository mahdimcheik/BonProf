import { Injectable, linkedSignal } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class MainService {
    ApplicationName = 'BonProf';
    logoUrl = 'assets/bird.svg';

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
}

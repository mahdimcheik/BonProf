import { Injectable, linkedSignal } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class MainService {
    ApplicationName = 'BonProf';

    mainTopbarLinks = linkedSignal<MenuItem[]>(() => {
        return [
            { label: 'Accueil', routerLink: '/' },
            { label: 'Documentation', routerLink: '/documentation' },
            { label: 'Mentions Légales', routerLink: '/mentions-legales' }
        ] as MenuItem[];
    });
}

import { layoutConfig } from '@/layout/service/layout.service';
import { Injectable } from '@angular/core';
import { Theme } from '@primeuix/themes/types';
/**
 * Service pour gérer le stockage local (localStorage).
 * Fournit des méthodes pour obtenir et définir le thème, l'utilisateur et la configuration de mise en page.
 * Utilise JSON pour sérialiser et désérialiser les données stockées.
 * Inclut une méthode pour réinitialiser les données utilisateur et les tokens.
 */
@Injectable({
    providedIn: 'root'
})
export class LocalstorageService {
    getTheme(): Theme {
        const theme = JSON.parse(localStorage.getItem('theme') || '{}');
        return theme;
    }
    setTheme(theme: Theme) {
        localStorage.setItem('theme', JSON.stringify(theme));
    }
    setUser(user: any) {
        localStorage.setItem('user', JSON.stringify(user));
    }
    getUser(): any {
        return JSON.parse(localStorage.getItem('user') || '{}') as any;
    }
    getLayoutConfig(): layoutConfig {
        return JSON.parse(localStorage.getItem('layoutConfig') || '{}');
    }
    setLayoutConfig(config: layoutConfig) {
        localStorage.setItem('layoutConfig', JSON.stringify(config));
    }
    reset() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    }
    constructor() {}
}

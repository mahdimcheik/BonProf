import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'app-access',
    standalone: true,
    imports: [ButtonModule, RouterModule, RippleModule, ButtonModule],
    template: ` <div class="flex items-center justify-center min-h-screen overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="padding: 0.3rem; ">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20 flex flex-col items-center">
                    <bp-logo [width]="150" class="mb-8 cursor-pointer" />
                    <span class="text-primary font-bold text-3xl">403</span>
                    <h1 class="text-surface-900 dark:text-surface-0 font-bold text-3xl lg:text-5xl mb-2">Accès réfusé</h1>
                    <div class="text-surface-600 dark:text-surface-200 mb-8">Possibles raisons</div>
                    <a routerLink="/" class="w-full flex items-center py-8 border-surface-300 dark:border-surface-500 border-b">
                        <span class="flex justify-center items-center border-2 border-primary text-primary rounded-border" style="height: 3.5rem; width: 3.5rem">
                            <i class="pi pi-fw pi-table text-2xl!"></i>
                        </span>
                        <span class="ml-6 flex flex-col">
                            <span class="text-surface-900 dark:text-surface-0 lg:text-xl font-medium mb-0 block">Compte banni ou non activé</span>
                            <span class="text-surface-600 dark:text-surface-200 lg:text-xl">Votre compte a peut-être été banni ou n'a pas encore été activé.</span>
                        </span>
                    </a>
                    <a routerLink="/" class="w-full flex items-center py-8 border-surface-300 dark:border-surface-500 border-b">
                        <span class="flex justify-center items-center border-2 border-primary text-primary rounded-border" style="height: 3.5rem; width: 3.5rem">
                            <i class="pi pi-fw pi-question-circle text-2xl!"></i>
                        </span>
                        <span class="ml-6 flex flex-col">
                            <span class="text-surface-900 dark:text-surface-0 lg:text-xl font-medium mb-0">Contacter un administrateur</span>
                            <span class="text-surface-600 dark:text-surface-200 lg:text-xl">Nous nous engageons à vous aider</span>
                        </span>
                    </a>
                    <p-button label="Aller à l'accueil" routerLink="/" class="mt-4" />
                </div>
            </div>
        </div>
    </div>`
})
export class Access {}

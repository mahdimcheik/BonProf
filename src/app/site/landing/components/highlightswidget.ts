import { MainService } from '@/pages/shared/services/main.service';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'highlights-widget',
    imports: [ButtonModule, RippleModule, RouterLink],
    template: `
        <div id="highlights" class="py-6 px-6 lg:px-20 mx-0 my-12 lg:mx-20">
            <div class="text-center mb-12">
                <h1 class="text-surface-900 dark:text-surface-0 font-bold mb-4 text-5xl">Réussissez avec les meilleurs professeurs</h1>
                <span class="text-muted-color text-2xl">La plateforme qui connecte élèves et professeurs pour un apprentissage sur mesure</span>
            </div>

            <div class="grid grid-cols-12 gap-6 mt-12">
                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <div class="p-6 bg-surface-0 dark:bg-surface-800 rounded-xl shadow-sm h-full text-center">
                        <div class="flex items-center justify-center bg-green-100 dark:bg-green-900 mx-auto mb-4" style="width: 4rem; height: 4rem; border-radius: 12px">
                            <i class="pi pi-verified text-3xl text-green-600 dark:text-green-400"></i>
                        </div>
                        <h3 class="text-surface-900 dark:text-surface-0 text-xl font-semibold mb-2">Professeurs qualifiés</h3>
                        <p class="text-surface-600 dark:text-surface-300 text-base leading-relaxed">Des enseignants sélectionnés pour leur expertise et leur pédagogie</p>
                    </div>
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <div class="p-6 bg-surface-0 dark:bg-surface-800 rounded-xl shadow-sm h-full text-center">
                        <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-900 mx-auto mb-4" style="width: 4rem; height: 4rem; border-radius: 12px">
                            <i class="pi pi-calendar text-3xl text-blue-600 dark:text-blue-400"></i>
                        </div>
                        <h3 class="text-surface-900 dark:text-surface-0 text-xl font-semibold mb-2">Réservation simple</h3>
                        <p class="text-surface-600 dark:text-surface-300 text-base leading-relaxed">Choisissez un créneau et réservez votre cours en quelques clics</p>
                    </div>
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <div class="p-6 bg-surface-0 dark:bg-surface-800 rounded-xl shadow-sm h-full text-center">
                        <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-900 mx-auto mb-4" style="width: 4rem; height: 4rem; border-radius: 12px">
                            <i class="pi pi-shield text-3xl text-purple-600 dark:text-purple-400"></i>
                        </div>
                        <h3 class="text-surface-900 dark:text-surface-0 text-xl font-semibold mb-2">Paiement 100% sécurisé</h3>
                        <p class="text-surface-600 dark:text-surface-300 text-base leading-relaxed">Transactions protégées par Stripe, sans frais cachés</p>
                    </div>
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <div class="p-6 bg-surface-0 dark:bg-surface-800 rounded-xl shadow-sm h-full text-center">
                        <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-900 mx-auto mb-4" style="width: 4rem; height: 4rem; border-radius: 12px">
                            <i class="pi pi-chart-line text-3xl text-orange-600 dark:text-orange-400"></i>
                        </div>
                        <h3 class="text-surface-900 dark:text-surface-0 text-xl font-semibold mb-2">Progression suivie</h3>
                        <p class="text-surface-600 dark:text-surface-300 text-base leading-relaxed">Historique complet et suivi de votre parcours d'apprentissage</p>
                    </div>
                </div>
            </div>

            @if (!mainService.isTeacher()) {
                <div class="text-center mt-12">
                    <p-button label="Chercher un bon prof" icon="pi pi-arrow-right" iconPos="right" size="large" [routerLink]="'/fast-search'" />
                </div>
            }
        </div>
    `
})
export class HighlightsWidget {
    mainService = inject(MainService);
}

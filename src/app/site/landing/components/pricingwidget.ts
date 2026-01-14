import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'pricing-widget',
    imports: [DividerModule, ButtonModule, RippleModule],
    template: `
        <div id="pricing" class="py-6 px-6 lg:px-20 my-8">
            <div class="text-center mb-12">
                <h2 class="text-surface-900 dark:text-surface-0 font-bold mb-4 text-4xl">Des tarifs simples et transparents</h2>
                <span class="text-muted-color text-2xl">Inscription gratuite, sans engagement. Vous ne payez que les cours réservés.</span>
            </div>

            <div class="grid grid-cols-12 gap-6 justify-center">
                <div class="col-span-12 lg:col-span-6 p-0 md:p-4">
                    <div class="p-6 flex flex-col border-primary dark:border-primary border-2 hover:border-primary duration-300 transition-all h-full" style="border-radius: 12px">
                        <div class="text-center mb-6">
                            <div class="text-surface-900 dark:text-surface-0 text-2xl font-semibold mb-2">Élève</div>
                            <div class="text-primary text-4xl font-bold">Gratuit</div>
                            <span class="text-muted-color">Sans abonnement</span>
                        </div>

                        <p-divider class="w-full"></p-divider>

                        <ul class="my-6 list-none p-0 flex flex-col gap-3 flex-grow">
                            <li class="flex items-center">
                                <i class="pi pi-check-circle text-xl text-green-500 mr-3"></i>
                                <span class="text-surface-700 dark:text-surface-200">Inscription et navigation gratuites</span>
                            </li>
                            <li class="flex items-center">
                                <i class="pi pi-check-circle text-xl text-green-500 mr-3"></i>
                                <span class="text-surface-700 dark:text-surface-200">Accès à tous les profils professeurs</span>
                            </li>
                            <li class="flex items-center">
                                <i class="pi pi-check-circle text-xl text-green-500 mr-3"></i>
                                <span class="text-surface-700 dark:text-surface-200">Réservation de cours à l'unité</span>
                            </li>
                            <li class="flex items-center">
                                <i class="pi pi-check-circle text-xl text-green-500 mr-3"></i>
                                <span class="text-surface-700 dark:text-surface-200">Chat avec les professeurs</span>
                            </li>
                            <li class="flex items-center">
                                <i class="pi pi-check-circle text-xl text-green-500 mr-3"></i>
                                <span class="text-surface-700 dark:text-surface-200">Historique et suivi des cours</span>
                            </li>
                        </ul>

                        <p-button label="S'inscrire gratuitement" styleClass="w-full" outlined />
                    </div>
                </div>

                <div class="col-span-12 lg:col-span-6 p-0 md:p-4">
                    <div class="p-6 flex flex-col border-primary border-2 h-full relative" style="border-radius: 12px">
                        <div class="text-center mb-6">
                            <div class="text-surface-900 dark:text-surface-0 text-2xl font-semibold mb-2">Professeur</div>
                            <div class="text-primary text-4xl font-bold">Gratuit</div>
                            <span class="text-muted-color">Commission sur les cours effectués</span>
                        </div>

                        <p-divider class="w-full"></p-divider>

                        <ul class="my-6 list-none p-0 flex flex-col gap-3 flex-grow">
                            <li class="flex items-center">
                                <i class="pi pi-check-circle text-xl text-green-500 mr-3"></i>
                                <span class="text-surface-700 dark:text-surface-200">Création de profil professeur</span>
                            </li>
                            <li class="flex items-center">
                                <i class="pi pi-check-circle text-xl text-green-500 mr-3"></i>
                                <span class="text-surface-700 dark:text-surface-200">Gestion libre de vos créneaux</span>
                            </li>
                            <li class="flex items-center">
                                <i class="pi pi-check-circle text-xl text-green-500 mr-3"></i>
                                <span class="text-surface-700 dark:text-surface-200">Paiements sécurisés sur votre compte</span>
                            </li>
                            <li class="flex items-center">
                                <i class="pi pi-check-circle text-xl text-green-500 mr-3"></i>
                                <span class="text-surface-700 dark:text-surface-200">Partage de documents avec vos élèves</span>
                            </li>
                            <li class="flex items-center">
                                <i class="pi pi-check-circle text-xl text-green-500 mr-3"></i>
                                <span class="text-surface-700 dark:text-surface-200">Visibilité auprès de milliers d'élèves</span>
                            </li>
                        </ul>

                        <p-button label="Devenir professeur" styleClass="w-full" />
                    </div>
                </div>
            </div>
        </div>
    `
})
export class PricingWidget {}

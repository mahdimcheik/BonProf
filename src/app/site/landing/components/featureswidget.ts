import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'features-widget',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div id="features" class="py-6 px-6 lg:px-6 mt-8 mx-0 lg:mx-20">
            <div class="text-center mb-12">
                <h2 class="text-surface-900 dark:text-surface-0 font-bold mb-4 text-4xl">Tout ce qu'il faut pour apprendre et enseigner</h2>
                <span class="text-muted-color text-2xl">Une plateforme complète conçue pour faciliter l'apprentissage à distance</span>
            </div>

            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-12 md:col-span-6 lg:col-span-3 p-0">
                    <div class="p-6 bg-surface-0 dark:bg-surface-900 rounded-xl h-full border border-surface-200 dark:border-surface-700">
                        <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-900 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="pi pi-calendar-plus text-2xl text-blue-600 dark:text-blue-400"></i>
                        </div>
                        <h5 class="mb-2 text-surface-900 dark:text-surface-0 font-semibold">Gestion des disponibilités</h5>
                        <span class="text-surface-600 dark:text-surface-300">Les professeurs définissent leurs créneaux, les élèves réservent en temps réel</span>
                    </div>
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3 p-0">
                    <div class="p-6 bg-surface-0 dark:bg-surface-900 rounded-xl h-full border border-surface-200 dark:border-surface-700">
                        <div class="flex items-center justify-center bg-green-100 dark:bg-green-900 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="pi pi-credit-card text-2xl text-green-600 dark:text-green-400"></i>
                        </div>
                        <h5 class="mb-2 text-surface-900 dark:text-surface-0 font-semibold">Paiement intégré</h5>
                        <span class="text-surface-600 dark:text-surface-300">Règlement sécurisé par Stripe avec confirmation instantanée</span>
                    </div>
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3 p-0">
                    <div class="p-6 bg-surface-0 dark:bg-surface-900 rounded-xl h-full border border-surface-200 dark:border-surface-700">
                        <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-900 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="pi pi-comments text-2xl text-purple-600 dark:text-purple-400"></i>
                        </div>
                        <h5 class="mb-2 text-surface-900 dark:text-surface-0 font-semibold">Chat en temps réel</h5>
                        <span class="text-surface-600 dark:text-surface-300">Échangez directement avec votre professeur avant et après les cours</span>
                    </div>
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3 p-0">
                    <div class="p-6 bg-surface-0 dark:bg-surface-900 rounded-xl h-full border border-surface-200 dark:border-surface-700">
                        <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-900 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="pi pi-history text-2xl text-orange-600 dark:text-orange-400"></i>
                        </div>
                        <h5 class="mb-2 text-surface-900 dark:text-surface-0 font-semibold">Historique des cours</h5>
                        <span class="text-surface-600 dark:text-surface-300">Retrouvez tous vos cours passés, statuts et notes en un seul endroit</span>
                    </div>
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3 p-0">
                    <div class="p-6 bg-surface-0 dark:bg-surface-900 rounded-xl h-full border border-surface-200 dark:border-surface-700">
                        <div class="flex items-center justify-center bg-red-100 dark:bg-red-900 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="pi pi-file-pdf text-2xl text-red-600 dark:text-red-400"></i>
                        </div>
                        <h5 class="mb-2 text-surface-900 dark:text-surface-0 font-semibold">Partage de documents</h5>
                        <span class="text-surface-600 dark:text-surface-300">Envoyez et recevez des PDF, images et supports pédagogiques</span>
                    </div>
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3 p-0">
                    <div class="p-6 bg-surface-0 dark:bg-surface-900 rounded-xl h-full border border-surface-200 dark:border-surface-700">
                        <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-900 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="pi pi-user text-2xl text-cyan-600 dark:text-cyan-400"></i>
                        </div>
                        <h5 class="mb-2 text-surface-900 dark:text-surface-0 font-semibold">Espace dédié</h5>
                        <span class="text-surface-600 dark:text-surface-300">Interface adaptée selon votre profil : élève ou professeur</span>
                    </div>
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3 p-0">
                    <div class="p-6 bg-surface-0 dark:bg-surface-900 rounded-xl h-full border border-surface-200 dark:border-surface-700">
                        <div class="flex items-center justify-center bg-yellow-100 dark:bg-yellow-900 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="pi pi-mobile text-2xl text-yellow-600 dark:text-yellow-400"></i>
                        </div>
                        <h5 class="mb-2 text-surface-900 dark:text-surface-0 font-semibold">Multi-appareils</h5>
                        <span class="text-surface-600 dark:text-surface-300">Accessible sur ordinateur, tablette et smartphone</span>
                    </div>
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3 p-0">
                    <div class="p-6 bg-surface-0 dark:bg-surface-900 rounded-xl h-full border border-surface-200 dark:border-surface-700">
                        <div class="flex items-center justify-center bg-pink-100 dark:bg-pink-900 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="pi pi-bell text-2xl text-pink-600 dark:text-pink-400"></i>
                        </div>
                        <h5 class="mb-2 text-surface-900 dark:text-surface-0 font-semibold">Notifications intelligentes</h5>
                        <span class="text-surface-600 dark:text-surface-300">Rappels automatiques pour ne manquer aucun cours</span>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class FeaturesWidget { }

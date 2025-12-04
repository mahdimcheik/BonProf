import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'features-widget',
    standalone: true,
    imports: [CommonModule],
    template: ` <div id="features" class="py-6 px-6 lg:px-6 mt-8 mx-0 lg:mx-20">
        <div class="grid grid-cols-12 gap-4 justify-center">
            <div class="col-span-12 text-center mt-20 mb-6">
                <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Vos avis comptent</div>
                <span class="text-muted-color text-2xl">Merci pour votre confiance</span>
            </div>

            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(172, 180, 223, 0.2))">
                    <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                        <div class="flex items-center justify-center bg-yellow-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="pi pi-fw pi-users text-2xl! text-yellow-700"></i>
                        </div>
                        <h5 class="mb-2 text-surface-900 dark:text-surface-0">Easy to Use</h5>
                        <span class="text-surface-600 dark:text-surface-200">Posuere morbi leo urna molestie.</span>
                    </div>
                </div>
            </div>

            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(172, 180, 223, 0.2))">
                    <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                        <div class="flex items-center justify-center bg-cyan-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="pi pi-fw pi-palette text-2xl! text-cyan-700"></i>
                        </div>
                        <h5 class="mb-2 text-surface-900 dark:text-surface-0">Fresh Design</h5>
                        <span class="text-surface-600 dark:text-surface-200">Semper risus in hendrerit.</span>
                    </div>
                </div>
            </div>

            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg-4 mt-6 lg:mt-0">
                <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(160, 210, 250, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(246, 158, 188, 0.2), rgba(212, 162, 221, 0.2))">
                    <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                        <div class="flex items-center justify-center bg-purple-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                            <i class="pi pi-fw pi-eye text-2xl! text-purple-700"></i>
                        </div>
                        <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">Privacy</div>
                        <span class="text-surface-600 dark:text-surface-200">Neque egestas congue quisque.</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-full mt-2 mb-2 p-2 md:p-20 bg-gray-200 dark:bg-transparent">
            <div class="flex flex-col justify-center items-center text-center px-4 py-4 md:py-0">
                <div class="text-gray-900 dark:text-gray-100 mb-2 text-3xl font-semibold">
                    <div>Prof de la semaine</div>
                    <div class="flex flex-col md:flex-row justify-center items-center mt-4 items-center gap-4 mb-4">
                        <span class="text-gray-600 dark:text-gray-300 text-2xl">Marie Delaire</span>

                        <img src="assets/teacher.png" class=" w-[50px] h-[50px] rounded-full" alt="Company logo" />
                    </div>

                    <p class="text-gray-900 dark:text-gray-100 sm:line-height-2 md:line-height-4 text-2xl mt-6" style="max-width: 800px">
                        “Depuis 2018, en tant que freelance, j'ai développé une solide expertise dans la création de sites web avec WordPress. En 2024, j'ai obtenu mon titre de Développeur Web et Web Mobile JavaScript à la Wild Code School. J'ai
                        renforcé mes compétences en intégrant une POEC Java/Angular.”
                    </p>
                </div>
            </div>
        </div>
    </div>`
})
export class FeaturesWidget {}

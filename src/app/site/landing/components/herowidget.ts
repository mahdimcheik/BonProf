import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'hero-widget',
    imports: [ButtonModule, RippleModule, InputTextModule],
    template: `
        <div id="hero" class="flex flex-col pt-6 px-6 pb-6 lg:px-20 overflow-hidden bg-green-200 md:flex-row md:items-center md:justify-between rounded-border">
            <div class="mx-6 md:mx-20 mt-0 md:mt-6">
                <h1 class="text-6xl font-bold text-gray-900 leading-tight dark:!text-gray-700"><span class="font-light block">Vos cours</span>à votre portée</h1>
                <p class="font-normal text-2xl leading-normal md:mt-4 text-gray-700 dark:text-gray-700">Reserver, payer, consulter et suivre vos cours facilement.</p>
                <div class="flex flex-col md:flex-row md:items-center md:gap-4 gap-4">
                    <input pInputText type="text" placeholder="Rechercher un cours" class="w-full md:w-64 !h-[45px] !min-h-[45px] flex-1" />
                    <button pButton pRipple type="button" label="Réserver" class="text-xl! "></button>
                </div>
            </div>
            <div class="flex justify-center md:justify-end  mt-6 md:mt-0">
                <img src="assets/banner.webp" alt="Hero Image" class="w-full md:w-[400px] h-auto" />
            </div>
        </div>
    `
})
export class HeroWidget {}

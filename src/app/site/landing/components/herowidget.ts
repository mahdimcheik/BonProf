import { CityDetails } from '@/pages/shared/models/geolocalisation';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'hero-widget',
    imports: [ButtonModule, RippleModule, InputTextModule, AutoCompleteModule, CommonModule, FormsModule],
    template: `
        <div id="hero" class="flex flex-col pt-6 px-6 pb-12 lg:px-20 overflow-hidden bg-green-200 md:flex-row md:items-center md:justify-between rounded-border">
            <div class="mx-6 md:mx-20 mt-0 md:mt-6">
                <h1 class="text-6xl font-bold text-gray-900 leading-tight dark:!text-gray-700"><span class="font-light block">Vos cours</span>à votre portée</h1>
                <p class="font-normal text-2xl leading-normal md:mt-4 text-gray-700 dark:text-gray-700">Reserver, payer, consulter et suivre vos cours facilement.</p>
                <div class="flex flex-col md:flex-row md:items-center md:gap-4 gap-4">
                    <p-autocomplete (completeMethod)="search($event)" [suggestions]="cities()" optionLabel="name" class="!w-full !md:w-64 !h-[45px] !min-h-[45px] flex-1">
                        <ng-template let-cityDetails #item>
                            <div class="flex items-center gap-2">
                                <div>{{ cityDetails.properties.postcode }} {{ cityDetails.properties.city }}</div>
                            </div>
                        </ng-template>
                        <ng-template #header>
                            <div class="font-medium px-3 py-2">Villes et codes postaux</div>
                        </ng-template>
                    </p-autocomplete>
                    <button pButton pRipple type="button" label="Réserver" class="text-xl! "></button>
                </div>
            </div>
            <div class="flex justify-center md:justify-end  mt-6 md:mt-0">
                <img src="assets/banner.webp" alt="Hero Image" class="w-full md:w-[400px] h-auto" />
            </div>
        </div>
    `
})
export class HeroWidget {
    destroyRef = inject(DestroyRef);
    httpclient = inject(HttpClient);

    cities = signal<CityDetails[]>([]);

    async search(event: AutoCompleteCompleteEvent) {
        console.log(event);

        const response = await firstValueFrom(this.httpclient.get<any>(`https://api-adresse.data.gouv.fr/search/?q=${event.query}&type=municipality`, { withCredentials: false }));
        console.log(response.features);

        this.cities.set(response.features);
    }
}

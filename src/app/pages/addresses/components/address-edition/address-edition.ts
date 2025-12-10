import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { Structure } from '@/pages/components/configurable-form/related-models';
import { CityDetails } from '@/pages/shared/models/geolocalisation';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, model, output, signal } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { firstValueFrom } from 'rxjs';
import { AddressCreate, AddressDetails, AddressUpdate } from 'src/client';

@Component({
    selector: 'bp-address-edition',
    imports: [ConfigurableFormComponent, AutoComplete, CommonModule, FormsModule],
    templateUrl: './address-edition.html'
})
export class AddressEdition {
    httpclient = inject(HttpClient);
    clickSubmit = output<AddressDetails | AddressCreate | AddressUpdate>();
    clickCancel = output<void>();
    address = model<AddressDetails | AddressCreate | undefined>(undefined);

    // Cities for autocomplete
    cities = signal<CityDetails[]>([]);
    selectedCity: CityDetails | null = null;

    addressForm = computed<Structure>(() => {
        const address = this.address();
        return {
            id: 'address',
            name: 'Address',
            label: 'Address',

            styleClass: 'md:min-w-full min-w-full !p-0',
            formFieldGroups: [
                {
                    id: 'informations',
                    name: address ? `Editer l'adresse: ${address.city}` : 'Ajouter une adresse',
                    label: address ? `Editer l'adresse: ${address.city}` : 'Ajouter une adresse',
                    fields: [
                        { id: 'city', label: 'Ville', name: 'city', type: 'text', required: true, value: address ? address.city : '', placeholder: 'Ville' },
                        { id: 'street', label: 'Rue', name: 'street', type: 'text', required: false, value: address ? address.street : '', placeholder: 'Rue' },
                        { id: 'postalCode', label: 'Code Postal', name: 'postalCode', type: 'text', required: false, value: address ? address.zipCode : '', placeholder: 'Code Postal' },
                        { id: 'additionalInfo', label: 'Informations supplémentaires', name: 'additionalInfo', type: 'text', required: false, value: address ? address.additionalInfo : '', placeholder: 'Informations supplémentaires' }
                    ]
                }
            ]
        };
    });

    async asyncAction(event: any): Promise<CityDetails[]> {
        const response = await firstValueFrom(this.httpclient.get<any>(`https://api-adresse.data.gouv.fr/search/?q=${event.query}&type=municipality`, { withCredentials: false }));

        const citiesWithLabel = response.features.map((city: CityDetails) => ({
            ...city,
            displayLabel: `${city.properties.postcode} ${city.properties.city}`
        }));

        this.cities.set(citiesWithLabel);
        this.address.set(this.selectedCity ? this.cityToAddress(this.selectedCity!) : undefined);

        return citiesWithLabel;
    }
    cityToAddress(city: CityDetails): AddressCreate {
        return {
            city: city.properties.city,
            zipCode: city.properties.postcode,
            street: '',
            state: city.properties.context,
            country: 'France',
            additionalInfo: ''
        };
    }

    submit($event: FormGroup<any>) {
        const values = $event.value.informations;
        // if (this.formation()) {
        //     const updatedFormation: FormationUpdate = values;
        //     updatedFormation.id = this.formation()!.id;
        //     this.clickSubmit.emit(updatedFormation);
        // } else {
        //     this.clickSubmit.emit(values as FormationCreate);
        // }
    }
    onCancel() {
        this.clickCancel.emit();
    }

    async search(event: AutoCompleteCompleteEvent) {
        const response = await firstValueFrom(this.httpclient.get<any>(`https://api-adresse.data.gouv.fr/search/?q=${event.query}&type=municipality`, { withCredentials: false }));

        const citiesWithLabel = response.features.map((city: CityDetails) => ({
            ...city,
            displayLabel: `${city.properties.postcode} ${city.properties.city}`
        }));

        console.log('selected city', citiesWithLabel);

        this.cities.set(citiesWithLabel);
        console.log('selected city mmm', this.selectedCity);

        this.address.set(this.selectedCity ? this.cityToAddress(this.selectedCity!) : undefined);
    }

    // getCityLabel(city: CityDetails): string {
    //     return `${city.properties.postcode} ${city.properties.city}`;
    // }
}

import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { Structure } from '@/pages/components/configurable-form/related-models';
import { CityDetails } from '@/pages/shared/models/geolocalisation';
import { AddressWrapperService } from '@/pages/shared/services/address-wrapper-service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, model, OnInit, output, signal } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Card } from 'primeng/card';
import { firstValueFrom } from 'rxjs';
import { AddressCreate, AddressDetails, AddressUpdate } from 'src/client';

@Component({
    selector: 'bp-address-edition',
    imports: [ConfigurableFormComponent, AutoComplete, CommonModule, FormsModule, Card],
    templateUrl: './address-edition.html'
})
export class AddressEdition implements OnInit {
    addressWrapperService = inject(AddressWrapperService);
    httpclient = inject(HttpClient);
    clickSubmit = output<AddressDetails | AddressCreate | AddressUpdate>();
    clickCancel = output<void>();
    address = model<AddressDetails | AddressCreate | undefined>(undefined);
    types = this.addressWrapperService.typeAddresses;

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
                        { id: 'typeId', label: "Type d'adresse", name: 'typeId', type: 'radio', required: false, value: address ? address.typeId : '', compareKey: 'id', options: this.types(), fullWidth: true, displayKey: 'name' },
                        { id: 'city', label: 'Ville', name: 'city', type: 'text', required: true, value: address ? address.city : '', placeholder: 'Ville' },
                        { id: 'street', label: 'Rue', name: 'street', type: 'text', required: false, value: address ? address.street : '', placeholder: 'Rue' },
                        { id: 'zipCode', label: 'Code Postal', name: 'zipCode', type: 'text', required: false, value: address ? address.zipCode : '', placeholder: 'Code Postal' },
                        { id: 'additionalInfo', label: 'Informations supplémentaires', name: 'additionalInfo', type: 'text', required: false, value: address ? address.additionalInfo : '', placeholder: 'Informations supplémentaires' }
                    ]
                }
            ]
        };
    });

    ngOnInit(): void {
        this.loadData();
    }

    async loadData() {
        await firstValueFrom(this.addressWrapperService.getAddressTypes());
    }

    // async asyncAction(event: any): Promise<CityDetails[]> {
    //     const response = await firstValueFrom(this.httpclient.get<any>(`https://api-adresse.data.gouv.fr/search/?q=${event.query}&type=municipality`, { withCredentials: false }));

    //     const citiesWithLabel = response.features.map((city: CityDetails) => ({
    //         ...city,
    //         displayLabel: `${city.properties.postcode} ${city.properties.city}`
    //     }));

    //     this.cities.set(citiesWithLabel);
    //     this.address.set(this.selectedCity ? this.cityToAddress(this.selectedCity!) : undefined);

    //     return citiesWithLabel;
    // }
    cityToAddress(city: CityDetails): AddressCreate {
        return {
            city: city.properties.city,
            zipCode: city.properties.postcode,
            street: '',
            country: 'France',
            latitude: city.geometry.coordinates[1],
            longitude: city.geometry.coordinates[0],
            additionalInfo: '',
            userId: '',
            typeId: '0'
        };
    }

    submit($event: FormGroup<any>) {
        const values = $event.value.informations;
        // if (this.address()) {
        //     values.country = 'France';
        //     const updatedAddress: AddressUpdate = values;
        //     updatedAddress.id = (this.address() as AddressDetails)!.id;
        //     this.clickSubmit.emit(updatedAddress);
        // } else {
        //     values.country = 'France';
        //     this.clickSubmit.emit(values as AddressCreate);
        // }
        if (this.address() && (this.address() as any)?.id) {
            values.id = (this.address() as AddressDetails).id;
            const addressUpdate = {
                ...values,
                country: 'France',
                id: (this.address() as AddressDetails).id,
                latitude: this.address() ? (this.address() as AddressCreate).latitude : 0,
                longitude: this.address() ? (this.address() as AddressCreate).longitude : 0
            };
            this.clickSubmit.emit(addressUpdate as AddressUpdate);
        } else {
            const addressCreate = {
                ...values,
                country: 'France',
                latitude: this.address() ? (this.address() as AddressCreate).latitude : 0,
                longitude: this.address() ? (this.address() as AddressCreate).longitude : 0
            };
            this.clickSubmit.emit(addressCreate as AddressCreate);
        }
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

        this.cities.set(citiesWithLabel);
    }

    onCitySelect(event: any) {
        if (event.value) {
            this.address.set(this.cityToAddress(event.value));
        }
    }
}

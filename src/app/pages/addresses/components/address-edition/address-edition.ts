import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { Structure } from '@/pages/components/configurable-form/related-models';
import { Component, computed, model, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AddressCreate, AddressDetails, AddressUpdate } from 'src/client';

@Component({
    selector: 'bp-address-edition',
    imports: [ConfigurableFormComponent],
    templateUrl: './address-edition.html'
})
export class AddressEdition {
    clickSubmit = output<AddressDetails | AddressCreate | AddressUpdate>();
    clickCancel = output<void>();
    address = model<AddressDetails | undefined>(undefined);

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
                        // { id: 'country', label: 'Pays', name: 'country', type: 'text', required: true, value: address ? address.country : '', placeholder: 'Pays' },
                        { id: 'street', label: 'Rue', name: 'street', type: 'text', required: false, value: address ? address.street : '', placeholder: 'Rue' },
                        { id: 'postalCode', label: 'Code Postal', name: 'postalCode', type: 'text', required: false, value: address ? address.zipCode : '', placeholder: 'Code Postal' },
                        { id: 'additionalInfo', label: 'Informations supplémentaires', name: 'additionalInfo', type: 'text', required: false, value: address ? address.additionalInfo : '', placeholder: 'Informations supplémentaires' }
                    ]
                }
            ]
        };
    });

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
}

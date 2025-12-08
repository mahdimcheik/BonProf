import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { Structure } from '@/pages/components/configurable-form/related-models';
import { Component, computed } from '@angular/core';

@Component({
    selector: 'bp-formations-edition',
    imports: [ConfigurableFormComponent],
    templateUrl: './formations-edition.html'
})
export class FormationsEdition {
    formationForm = computed<Structure>(() => {
        return {
            id: 'formation',
            name: 'Formation',
            label: 'Formation',
            styleClass: 'md:min-w-full min-w-full !p-0',
            formFieldGroups: [
                {
                    id: 'informations',
                    name: 'Informations de la formation',
                    label: 'Informations de la formation',
                    fields: [
                        { id: 'title', label: 'Titre', name: 'title', type: 'text', required: true, value: 'test' },
                        { id: 'institution', label: 'Institution', name: 'institution', type: 'text', required: true, value: 'test' },
                        { id: 'dateFrom', label: 'Date de début', name: 'dateFrom', type: 'date', required: true, value: 'test' },
                        { id: 'dateTo', label: 'Date de fin', name: 'dateTo', type: 'date', required: false, value: 'test' },
                        { id: 'description', label: 'Description', name: 'description', type: 'textarea', required: true, value: 'test', fullWidth: true }
                    ]
                }
            ]
        };
    });
}

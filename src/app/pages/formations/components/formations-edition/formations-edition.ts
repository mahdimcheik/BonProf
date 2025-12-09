import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { Structure } from '@/pages/components/configurable-form/related-models';
import { Component, computed, model, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormationCreate, FormationDetails, FormationUpdate } from 'src/client';

@Component({
    selector: 'bp-formations-edition',
    imports: [ConfigurableFormComponent],
    templateUrl: './formations-edition.html'
})
export class FormationsEdition {
    clickSubmit = output<FormationDetails | FormationCreate | FormationUpdate>();
    clickCancel = output<void>();
    formation = model<FormationDetails | undefined>(undefined);

    formationForm = computed<Structure>(() => {
        const formation = this.formation();
        return {
            id: 'formation',
            name: 'Formation',
            label: 'Formation',
            styleClass: 'md:min-w-full min-w-full !p-0',
            formFieldGroups: [
                {
                    id: 'informations',
                    name: formation ? `Editer la formation: ${formation.title}` : 'Ajouter une formation',
                    label: formation ? `Editer la formation: ${formation.title}` : 'Ajouter une formation',
                    fields: [
                        { id: 'title', label: 'Titre', name: 'title', type: 'text', required: true, value: formation ? formation.title : '', placeholder: 'Titre de la formation' },
                        { id: 'institute', label: 'Institution', name: 'institute', type: 'text', required: true, value: formation ? formation.institute : '', placeholder: 'Institution' },
                        { id: 'dateFrom', label: 'Date de début', name: 'dateFrom', type: 'date', required: true, value: formation ? new Date(formation.dateFrom) : '' },
                        { id: 'dateTo', label: 'Date de fin', name: 'dateTo', type: 'date', required: false, value: formation && formation.dateTo ? new Date(formation.dateTo) : '' },
                        { id: 'description', label: 'Description', name: 'description', type: 'textarea', required: true, value: formation ? formation.description : '', fullWidth: true, placeholder: 'Description' }
                    ]
                }
            ]
        };
    });

    submit($event: FormGroup<any>) {
        const values = $event.value.informations;
        if (this.formation()) {
            const updatedFormation: FormationUpdate = values;
            updatedFormation.id = this.formation()!.id;
            this.clickSubmit.emit(updatedFormation);
        } else {
            this.clickSubmit.emit(values as FormationCreate);
        }
    }
    onCancel() {
        this.clickCancel.emit();
    }
}

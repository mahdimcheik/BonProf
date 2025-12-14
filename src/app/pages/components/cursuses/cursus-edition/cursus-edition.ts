import { Component, computed, model, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CursusCreate, CursusDetails, CursusUpdate } from 'src/client';
import { ConfigurableFormComponent } from '../../configurable-form/configurable-form.component';
import { Structure } from '../../configurable-form/related-models';

@Component({
    selector: 'bp-cursus-edition',
    imports: [ConfigurableFormComponent],
    templateUrl: './cursus-edition.html'
})
export class CursusEdition {
    clickSubmit = output<CursusDetails | CursusCreate | CursusUpdate>();
    clickCancel = output<void>();
    cursus = model<CursusDetails | undefined>(undefined);

    cursusForm = computed<Structure>(() => {
        const cursus = this.cursus();
        return {
            id: 'cursus',
            name: 'Cursus',
            label: 'Cursus',
            styleClass: 'md:min-w-full min-w-full !p-0',
            formFieldGroups: [
                {
                    id: 'informations',
                    name: cursus ? `Editer le cursus: ${cursus.name}` : 'Ajouter un cursus',
                    label: cursus ? `Editer le cursus: ${cursus.name}` : 'Ajouter un cursus',
                    fields: [
                        { id: 'name', label: 'Titre', name: 'name', type: 'text', required: true, value: cursus ? cursus.name : '', placeholder: 'Titre du cursus' },
                        { id: 'color', label: 'Couleur', name: 'color', type: 'color', required: true, value: cursus ? cursus.color : '' },
                        { id: 'description', label: 'Description', name: 'description', type: 'textarea', required: true, value: cursus ? cursus.description : '', fullWidth: true, placeholder: 'Description' },
                        {
                            id: 'levelId',
                            label: 'Niveau',
                            name: 'levelId',
                            type: 'select',
                            required: false,
                            value: cursus ? cursus.levelId : '',
                            compareKey: 'id'
                        },
                        {
                            id: 'categoryIds',
                            label: 'Catégories',
                            name: 'categoryIds',
                            type: 'multiselect',
                            required: false,
                            value: cursus ? cursus.categories?.map((category) => category.id) : [],
                            compareKey: 'id'
                        }
                    ]
                }
            ]
        };
    });

    submit($event: FormGroup<any>) {
        const values = $event.value.informations;
        if (this.cursus()) {
            const updatedCursus: CursusUpdate = values;
            updatedCursus.id = this.cursus()!.id;
            this.clickSubmit.emit(updatedCursus);
        } else {
            this.clickSubmit.emit(values as CursusCreate);
        }
    }
    onCancel() {
        this.clickCancel.emit();
    }
}

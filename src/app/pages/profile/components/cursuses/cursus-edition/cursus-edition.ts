import { CursusWrapperService } from '@/pages/shared/services/cursus-wrapper-service';
import { MainService } from '@/pages/shared/services/main.service';
import { Component, computed, inject, model, OnInit, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { CursusCreate, CursusDetails, CursusUpdate } from 'src/client';
import { ConfigurableFormComponent } from '../../../../components/configurable-form/configurable-form.component';
import { Structure } from '../../../../components/configurable-form/related-models';

@Component({
    selector: 'bp-cursus-edition',
    imports: [ConfigurableFormComponent],
    templateUrl: './cursus-edition.html'
})
export class CursusEdition implements OnInit {
    cursusWrapperService = inject(CursusWrapperService);
    mainService = inject(MainService);

    clickSubmit = output<CursusDetails | CursusCreate | CursusUpdate>();
    clickCancel = output<void>();
    cursus = model<CursusDetails | undefined>(undefined);
    levels = this.cursusWrapperService.levelCursuses;
    categories = this.cursusWrapperService.categoryCursuses;

    cursusForm = computed<Structure>(() => {
        const cursus = this.cursus();
        return {
            id: 'cursus',
            name: 'Cursus',
            label: 'Cursus',
            styleClass: 'md:min-w-full min-w-full !p-0',
            sections: [
                {
                    id: 'informations',
                    name: cursus ? `Editer le cursus: ${cursus.name}` : 'Ajouter un cursus',
                    label: cursus ? `Editer le cursus: ${cursus.name}` : 'Ajouter un cursus',
                    fields: [
                        { id: 'name', label: 'Titre', name: 'name', type: 'text', required: true, value: cursus ? cursus.name : '', placeholder: 'Titre du cursus', fullWidth: true },
                        {
                            id: 'levelId',
                            label: 'Niveau',
                            name: 'levelId',
                            type: 'select',
                            required: false,
                            options: this.levels(),
                            displayKey: 'name',
                            value: cursus ? cursus.levelId : '',
                            compareKey: 'id'
                        },
                        {
                            id: 'categoryIds',
                            label: 'Catégories',
                            name: 'categoryIds',
                            type: 'multiselect',
                            required: false,
                            options: this.categories(),
                            displayKey: 'name',
                            value: cursus ? cursus.categories?.map((category) => category.id) : [],
                            compareKey: 'id'
                        },
                        { id: 'color', label: 'Couleur', name: 'color', type: 'color', required: true, value: cursus ? cursus.color : '', fullWidth: true },
                        { id: 'description', label: 'Description', name: 'description', type: 'textarea', required: true, value: cursus ? cursus.description : '', fullWidth: true, placeholder: 'Description' }
                    ]
                }
            ]
        };
    });

    ngOnInit(): void {
        this.loadData();
    }

    async loadData() {
        await firstValueFrom(this.cursusWrapperService.getCursusLevels());
        await firstValueFrom(this.cursusWrapperService.getCategories());
    }

    submit($event: FormGroup<any>) {
        const values = $event.value.informations;
        console.log(values);

        if (this.cursus()) {
            const updatedCursus: CursusUpdate = values;
            updatedCursus.id = this.cursus()!.id;
            this.clickSubmit.emit(updatedCursus);
        } else {
            values.teacherId = this.mainService.userConnected()?.id;
            this.clickSubmit.emit(values as CursusCreate);
        }
    }
    onCancel() {
        this.clickCancel.emit();
    }
}

import { SmartSectionComponent } from '@/pages/components/smart-section/smart-section.component';
import { FormationCard } from '@/pages/formations/components/formation-card/formation-card';
import { FormationsEdition } from '@/pages/formations/components/formations-edition/formations-edition';
import { FormationWrapperService } from '@/pages/shared/services/formation-wrapper-service';
import { Component, DestroyRef, inject, model, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { FormationCreate, FormationDetails } from 'src/client';

@Component({
    selector: 'bp-formations-list',
    imports: [SmartSectionComponent, FormationCard, FormationsEdition],
    templateUrl: './formations-list.html'
})
export class FormationsList {
    formationWrapperService = inject(FormationWrapperService);
    messageService = inject(MessageService);
    activatedRoute = inject(ActivatedRoute);
    destroyRef = inject(DestroyRef);

    title = 'Liste des Formations';

    editMode = model(true);
    buttonIcon = model('pi pi-plus');
    showEditBox = signal(false);

    formations = signal<FormationDetails[]>([
        {
            id: '1',
            title: 'Formation 1',
            description: 'Description de la formation 1',
            institute: 'Institut 1',
            dateFrom: new Date('2020-01-01'),
            dateTo: new Date('2020-06-01'),
            createdAt: new Date()
        },
        {
            id: '2',
            title: 'Formation 2',
            description: 'Description de la formation 2',
            institute: 'Institut 2',
            dateFrom: new Date('2021-01-01'),
            dateTo: new Date('2021-06-01'),
            createdAt: new Date()
        }
    ]);

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {
        const formationsData = await firstValueFrom(this.formationWrapperService.getFormations());
        this.formations.set(formationsData.data || []);
    }

    async showAddformationBox() {
        this.showEditBox.set(true);
    }

    hideAddFormationBox() {
        this.showEditBox.set(false);
    }

    cancel() {
        this.showEditBox.set(false);
    }

    async addNewFormation(event: FormationCreate) {
        const res = await firstValueFrom(this.formationWrapperService.addFormation(event));
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Formation ajoutée avec succès' });
        this.showEditBox.set(false);
        await this.loadData();
    }
}

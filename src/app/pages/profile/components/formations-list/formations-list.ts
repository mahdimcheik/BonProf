import { SmartSectionComponent } from '@/pages/components/smart-section/smart-section.component';
import { FormationCard } from '@/pages/formations/components/formation-card/formation-card';
import { FormationsEdition } from '@/pages/formations/components/formations-edition/formations-edition';
import { Component, DestroyRef, inject, model, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormationDetails } from 'src/client';

@Component({
    selector: 'bp-formations-list',
    imports: [SmartSectionComponent, FormationCard, FormationsEdition],
    templateUrl: './formations-list.html'
})
export class FormationsList {
    messageService = inject(MessageService);
    activatedRoute = inject(ActivatedRoute);
    destroyRef = inject(DestroyRef);

    title = 'Liste des Formations';

    editMode = model(true);
    buttonIcon = model('pi pi-plus');
    showEditModal = signal(false);

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

    async ngOnInit() {}

    async openModal() {
        this.showEditModal.set(true);
    }

    cancel() {
        this.showEditModal.set(false);
    }
}

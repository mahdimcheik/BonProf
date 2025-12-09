import { SmartElementComponent } from '@/pages/components/smart-element/smart-element.component';
import { FormationsEdition } from '@/pages/formations/components/formations-edition/formations-edition';
import { FormationWrapperService } from '@/pages/shared/services/formation-wrapper-service';
import { DatePipe } from '@angular/common';
import { Component, inject, model, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { FormationCreate, FormationDetails, FormationUpdate } from 'src/client';

@Component({
    selector: 'bp-formation-card',
    imports: [SmartElementComponent, DatePipe, FormationsEdition],
    templateUrl: './formation-card.html'
})
export class FormationCard {
    formationWrapperService = inject(FormationWrapperService);
    messageService = inject(MessageService);

    editMode = model(true);
    formation = model.required<FormationDetails>();
    showEditModal = signal(false);
    showDeleteConfirm = signal(false);

    cancel() {
        this.showEditModal.set(false);
    }

    openEditModal() {
        this.showEditModal.set(true);
    }

    async editFormation(formation: FormationDetails | FormationCreate | FormationUpdate) {
        try {
            const newFormation = await firstValueFrom(this.formationWrapperService.updateFormation(formation as FormationUpdate));
            if (newFormation.data) {
                this.formation.set(newFormation.data);
            }
        } finally {
            this.editMode.set(false);
        }
    }
}

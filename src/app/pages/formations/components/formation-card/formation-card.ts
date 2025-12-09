import { ConfirmModalComponent } from '@/pages/components/confirm-modal/confirm-modal.component';
import { SmartElementComponent } from '@/pages/components/smart-element/smart-element.component';
import { FormationsEdition } from '@/pages/formations/components/formations-edition/formations-edition';
import { FormationWrapperService } from '@/pages/shared/services/formation-wrapper-service';
import { DatePipe } from '@angular/common';
import { Component, inject, model, output, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { FormationCreate, FormationDetails, FormationUpdate } from 'src/client';

@Component({
    selector: 'bp-formation-card',
    imports: [SmartElementComponent, DatePipe, FormationsEdition, ConfirmModalComponent],
    templateUrl: './formation-card.html'
})
export class FormationCard {
    formationWrapperService = inject(FormationWrapperService);
    messageService = inject(MessageService);

    editMode = model(true);
    formation = model.required<FormationDetails>();
    showEditModal = signal(false);
    showDeleteConfirm = signal(false);
    needRefresh = output<boolean>();

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
    showConfirmModal() {
        this.showDeleteConfirm.set(true);
    }
    hideConfirmModal() {
        this.showDeleteConfirm.set(false);
    }

    async deleteFormation() {
        try {
            await firstValueFrom(this.formationWrapperService.deleteFormation(this.formation().id));
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'La formation a été supprimée avec succès.' });
            this.needRefresh.emit(true);
        } finally {
            this.showDeleteConfirm.set(false);
        }
    }
}

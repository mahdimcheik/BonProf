import { CursusWrapperService } from '@/pages/shared/services/cursus-wrapper-service';
import { Component, inject, model, output, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { firstValueFrom } from 'rxjs';
import { CursusCreate, CursusDetails, CursusUpdate } from 'src/client';
import { ConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';
import { CursusEdition } from '../cursus-edition/cursus-edition';

@Component({
    selector: 'bp-cursus-card',
    imports: [Card, Button, ConfirmModalComponent, CursusEdition],
    templateUrl: './cursus-card.html'
})
export class CursusCard {
    cursusWrapperService = inject(CursusWrapperService);
    messageService = inject(MessageService);

    editMode = model(true);
    cursus = model.required<CursusDetails>();
    showEditModal = signal(false);
    showDeleteConfirm = signal(false);
    needRefresh = output<boolean>();

    cancel() {
        this.showEditModal.set(false);
    }

    openEditModal() {
        this.showEditModal.set(true);
    }

    async editCursus(cursus: CursusDetails | CursusCreate | CursusUpdate) {
        // try {
        //     const newFormation = await firstValueFrom(this.formationWrapperService.updateFormation(formation as FormationUpdate));
        //     if (newFormation.data) {
        //         this.formation.set(newFormation.data);
        //     }
        // } finally {
        //     this.editMode.set(false);
        // }
    }
    showConfirmModal() {
        this.showDeleteConfirm.set(true);
    }
    hideConfirmModal() {
        this.showDeleteConfirm.set(false);
    }

    async deleteCursus() {
        try {
            await firstValueFrom(this.cursusWrapperService.delteCursus(this.cursus().id));
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Le cours a été supprimé avec succès.' });
            this.needRefresh.emit(true);
        } finally {
            this.showDeleteConfirm.set(false);
        }
    }
}

import { CursusWrapperService } from '@/pages/shared/services/cursus-wrapper-service';
import { Component, inject, model, output, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { firstValueFrom } from 'rxjs';
import { CursusCreate, CursusDetails, CursusUpdate } from 'src/client';
import { ConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';
import { CursusEdition } from '../cursus-edition/cursus-edition';

@Component({
    selector: 'bp-cursus-card',
    imports: [Card, Button, ConfirmModalComponent, CursusEdition, Tag, Tooltip],
    templateUrl: './cursus-card.html'
})
export class CursusCard {
    cursusWrapperService = inject(CursusWrapperService);
    messageService = inject(MessageService);

    editMode = model(true);
    showActions = signal(false);
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
        try {
            const newFormation = await firstValueFrom(this.cursusWrapperService.updateCursus(cursus as CursusUpdate));
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Cours édité avec succès' });
            if (newFormation.data) {
                this.cursus.set(newFormation.data);
            }
        } finally {
            this.showActions.set(false);
        }
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

import { SmartElementComponent } from '@/pages/components/smart-element/smart-element.component';
import { FormationsEdition } from '@/pages/formations/components/formations-edition/formations-edition';
import { DatePipe } from '@angular/common';
import { Component, inject, model, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormationDetails } from 'src/client';

@Component({
    selector: 'bp-formation-card',
    imports: [SmartElementComponent, DatePipe, FormationsEdition],
    templateUrl: './formation-card.html'
})
export class FormationCard {
    editMode = model(true);
    messageService = inject(MessageService);

    formation = model.required<FormationDetails>();
    showEditModal = signal(false);
    showDeleteConfirm = signal(false);

    cancel() {
        this.showEditModal.set(false);
    }

    openEditModal() {
        this.showEditModal.set(true);
    }
}

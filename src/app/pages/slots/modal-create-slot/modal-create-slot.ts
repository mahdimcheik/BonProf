import { BaseModalComponent } from '@/pages/components/base-modal/base-modal.component';
import { BaseSideModalComponent } from '@/pages/components/base-side-modal/base-side-modal.component';
import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { Structure } from '@/pages/components/configurable-form/related-models';
import { Component, computed, model } from '@angular/core';

@Component({
    selector: 'bp-modal-create-slot',
    imports: [BaseModalComponent, ConfigurableFormComponent, BaseSideModalComponent],
    templateUrl: './modal-create-slot.html'
})
export class ModalCreateSlot {
    visible = model(false);
    title = model('Créer un créneau');

    slotForm = computed<Structure>(() => {
        const visible = this.visible();
        return {
            id: 'slotForm',
            name: 'slotForm',
            label: 'Créer un créneau',
            styleClass: '!w-full min-w-full',
            sections: [
                {
                    id: 'slotDetails',
                    name: 'slotDetails',
                    label: 'Détails du créneau',
                    styleClass: '!w-full',
                    fields: [
                        {
                            id: 'dateFrom',
                            name: 'dateFrom',
                            type: 'date',
                            showTime: true,
                            fullWidth: true,
                            label: 'Date de début',
                            required: true,
                            placeholder: 'Sélectionner la date de début'
                        },
                        {
                            id: 'dateTo',
                            name: 'dateTo',
                            type: 'date',
                            showTime: true,
                            label: 'Date de fin',
                            required: true,
                            fullWidth: true,
                            placeholder: 'Sélectionner la date de fin'
                        }
                    ]
                }
            ]
        };
    });
}

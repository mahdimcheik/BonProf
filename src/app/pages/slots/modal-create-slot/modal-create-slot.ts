import { BaseModalComponent } from '@/pages/components/base-modal/base-modal.component';
import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { Structure } from '@/pages/components/configurable-form/related-models';
import { CalendarEvent } from '@/pages/shared/models/calendarModels';
import { Component, computed, model } from '@angular/core';

@Component({
    selector: 'bp-modal-create-slot',
    imports: [BaseModalComponent, ConfigurableFormComponent],
    templateUrl: './modal-create-slot.html'
})
export class ModalCreateSlot {
    visible = model(false);
    title = model('Créer un créneau');
    event = model.required<CalendarEvent>();

    slotForm = computed<Structure>(() => {
        const event = this.event();
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
                            timeOnly: true,
                            fullWidth: true,
                            label: 'Date de début',
                            required: true,
                            placeholder: 'Sélectionner la date de début',
                            value: event.startTime
                        },
                        {
                            id: 'dateTo',
                            name: 'dateTo',
                            type: 'date',
                            showTime: true,
                            timeOnly: true,
                            label: 'Date de fin',
                            required: true,
                            fullWidth: true,
                            placeholder: 'Sélectionner la date de fin',
                            value: event.endTime
                        }
                    ]
                }
            ]
        };
    });
}

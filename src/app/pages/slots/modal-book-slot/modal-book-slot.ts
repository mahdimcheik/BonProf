import { BaseModalComponent } from '@/pages/components/base-modal/base-modal.component';
import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { Structure } from '@/pages/components/configurable-form/related-models';
import { CalendarEvent } from '@/pages/shared/models/calendar-models';
import { TypeSlotWrapperService } from '@/pages/shared/services/type-slot-wrapper-service';
import { Component, computed, inject, model, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SlotDetails } from 'src/client';

@Component({
    selector: 'bp-modal-book-slot',
    imports: [BaseModalComponent, ConfigurableFormComponent],
    templateUrl: './modal-book-slot.html'
})
export class ModalBookSlot {
    typeSlotsService = inject(TypeSlotWrapperService);
    visible = model(false);
    title = model('Créer un créneau');
    event = model.required<CalendarEvent>();
    slot = computed<SlotDetails>(() => this.event()?.ExtendedProps?.['slot'] ?? null);
    submitClicked = output<SlotDetails>();
    cancelClicked = output<void>();
    typeSlots = this.typeSlotsService.typeSlots;

    slotForm = computed<Structure>(() => {
        const event = this.event();
        const options = this.typeSlots();
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
                            id: 'typeId',
                            name: 'typeId',
                            type: 'select',
                            options: options,
                            label: 'Type de créneau',
                            compareKey: 'id',
                            displayKey: 'name',
                            required: true,
                            placeholder: 'Sélectionner le type de créneau',
                            fullWidth: true,
                            value: event?.ExtendedProps?.['slot']?.typeId ?? options[0]?.id ?? null
                        },
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
                            value: event?.StartTime ?? new Date()
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
                            value: event?.EndTime ?? new Date()
                        }
                    ]
                }
            ]
        };
    });

    submit(form: FormGroup<any>) {
        // this.submitClicked.emit(slotDetails);
    }

    cancel() {
        this.cancelClicked.emit();
    }
}

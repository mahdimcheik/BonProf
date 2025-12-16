import { BaseModalComponent } from '@/pages/components/base-modal/base-modal.component';
import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { Structure } from '@/pages/components/configurable-form/related-models';
import { CalendarEvent } from '@/pages/shared/models/calendarModels';
import { TypeSlotWrapperService } from '@/pages/shared/services/type-slot-wrapper-service';
import { Component, computed, inject, model, OnInit, output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'bp-modal-create-slot',
    imports: [BaseModalComponent, ConfigurableFormComponent],
    templateUrl: './modal-create-slot.html'
})
export class ModalCreateSlot implements OnInit {
    typeSlotsService = inject(TypeSlotWrapperService);
    visible = model(false);
    title = model('Créer un créneau');
    event = model.required<CalendarEvent>();
    submitClicked = output<CalendarEvent>();
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
                            id: 'typeSlotId',
                            name: 'typeSlotId',
                            type: 'select',
                            options: options,
                            label: 'Type de créneau',
                            compareKey: 'id',
                            displayKey: 'name',
                            required: true,
                            placeholder: 'Sélectionner le type de créneau',
                            fullWidth: true,
                            value: null
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

    ngOnInit(): void {
        this.typeSlotsService.getAllTypeSlots().subscribe();
    }

    submit(formData: FormGroup<any>) {
        const newEvent: CalendarEvent = {
            ...formData.value.slotDetails,
            extendedProps: {
                typeSlotId: formData.value.slotDetails.typeSlotId
            }
        };
        this.submitClicked.emit(newEvent);
        this.visible.set(false);
    }
    cancel() {
        this.visible.set(false);
    }
}

import { BaseModalComponent } from '@/pages/components/base-modal/base-modal.component';
import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { Structure } from '@/pages/components/configurable-form/related-models';
import { CalendarEvent } from '@/pages/shared/models/calendar-models';
import { TypeSlotWrapperService } from '@/pages/shared/services/type-slot-wrapper-service';
import { Component, computed, inject, model, OnInit, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SlotCreate, SlotDetails, SlotUpdate } from 'src/client';

@Component({
    selector: 'bp-modal-reservation',
    imports: [BaseModalComponent, ConfigurableFormComponent],
    templateUrl: './modal-reservation.html'
})
export class ModalReservation {
    typeSlotsService = inject(TypeSlotWrapperService);
    visible = model(false);
    title = model('Créer un créneau');
    event = model.required<CalendarEvent>();
    slot = computed<SlotDetails>(() => this.event()?.ExtendedProps?.['slot'] ?? null);
    reservation = computed(() => this.slot()?.reservation ?? null);

    submitClicked = output<SlotCreate | SlotUpdate>();
    cancelClicked = output<void>();

    submit(formData: FormGroup<any>) {
        const newEvent = {
            ...formData.value.slotDetails,
            id: (this.slot() as any)?.id ?? undefined
        };
        this.submitClicked.emit(newEvent);
        this.visible.set(false);
    }
    cancel() {
        this.visible.set(false);
        this.cancelClicked.emit();
    }
}

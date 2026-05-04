import { BaseModalComponent } from '@/pages/components/base-modal/base-modal.component';
import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { Structure } from '@/pages/components/configurable-form/related-models';
import { CalendarEvent } from '@/pages/shared/models/calendar-models';
import { MainService } from '@/pages/shared/services/main.service';
import { ProductWrapperService } from '@/pages/shared/services/product-wrapper-service';
import { TypeSlotWrapperService } from '@/pages/shared/services/type-slot-wrapper-service';
import { Component, computed, inject, model, output, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ProductDetails, ReservationCreate, SlotDetails } from 'src/client';

@Component({
    selector: 'bp-modal-book-slot',
    imports: [BaseModalComponent, ConfigurableFormComponent],
    templateUrl: './modal-book-slot.html'
})
export class ModalBookSlot {
    typeSlotsService = inject(TypeSlotWrapperService);
    productWrapperService = inject(ProductWrapperService);
    mainService = inject(MainService);

    visible = model(false);
    title = model('Réserver ce créneau');
    event = model.required<CalendarEvent>();
    slot = computed<SlotDetails>(() => this.event()?.ExtendedProps?.['slot'] ?? null);
    submitClicked = output<ReservationCreate>();
    cancelClicked = output<void>();
    typeSlots = this.typeSlotsService.typeSlots;
    products = signal<ProductDetails[]>([]);

    slotForm = computed<Structure>(() => {
        const slot = this.slot();
        const options = this.typeSlots();
        return {
            id: 'slotForm',
            name: 'slotForm',
            label: 'Réserver ce créneau',
            styleClass: '!w-full min-w-full',
            sections: [
                {
                    id: 'slotDetails',
                    name: 'slotDetails',
                    styleClass: '!w-full',
                    fields: [
                        {
                            id: 'ProductId',
                            name: 'ProductId',
                            type: 'select',
                            label: 'Cours associé',
                            required: true,
                            fullWidth: true,
                            placeholder: 'Sélectionner le cours associé',
                            options: this.products(),
                            compareKey: 'id',
                            displayKey: 'name'
                        },
                        {
                            id: 'title',
                            name: 'title',
                            type: 'text',
                            label: 'Titre de la réservation',
                            required: true,
                            fullWidth: true,
                            placeholder: 'Entrer le titre de la réservation'
                        },
                        {
                            id: 'description',
                            name: 'description',
                            type: 'textarea',
                            label: 'Objectif de la réservation',
                            required: true,
                            fullWidth: true,
                            placeholder: 'Décrivez la raison de la réservation'
                        }
                    ]
                }
            ]
        };
    });

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {
        const productsData = await firstValueFrom(this.productWrapperService.getTeacherProducts(this.slot()?.teacher?.id || ''));
        this.products.set(productsData.data || []);
    }

    submit(form: FormGroup<any>) {
        const reservationCreate: ReservationCreate = {
            title: form.value.slotDetails.title,
            description: form.value.slotDetails.description,
            productId: form.value.slotDetails.ProductId,
            slotId: this.slot()?.id || '',
            studentId: this.mainService?.userConnected()?.id || ''
        };
        this.submitClicked.emit(reservationCreate);
    }

    cancel() {
        this.cancelClicked.emit();
    }
}

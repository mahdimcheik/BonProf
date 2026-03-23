import { BaseModalComponent } from '@/pages/components/base-modal/base-modal.component';
import { ConfigurableFormComponent } from '@/pages/components/configurable-form/configurable-form.component';
import { Structure } from '@/pages/components/configurable-form/related-models';
import { ConfirmModalComponent } from '@/pages/components/confirm-modal/confirm-modal.component';
import { CalendarEvent } from '@/pages/shared/models/calendar-models';
import { GenderPipe } from '@/pages/shared/pipes/gender-pipe';
import { SlotTypePipe } from '@/pages/shared/pipes/slot-type-pipe';
import { SlotWrapperService } from '@/pages/shared/services/slot-wrapper-service';
import { TypeSlotWrapperService } from '@/pages/shared/services/type-slot-wrapper-service';
import { Component, computed, inject, model, OnInit, output, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { firstValueFrom } from 'rxjs';
import { SlotCreate, SlotDetails, SlotUpdate } from 'src/client';

@Component({
    selector: 'bp-modal-create-slot',
    imports: [BaseModalComponent, ConfigurableFormComponent, Button, ConfirmModalComponent],
    templateUrl: './modal-create-slot.html',
    providers: [SlotTypePipe]
})
export class ModalCreateSlot implements OnInit {
    typeSlotsService = inject(TypeSlotWrapperService);
    messageService = inject(MessageService);
    slotWrapperService = inject(SlotWrapperService);
    slotTypePipe = inject(SlotTypePipe);

    visible = model(false);
    event = model.required<CalendarEvent>();
    slot = computed<SlotCreate | SlotUpdate | SlotDetails | null>(() => this.event()?.ExtendedProps?.['slot'] ?? null);
    title = computed(() => (this.slot() ? 'Modifier le créneau' : 'Créer un créneau'));
    submitButtonLabel = computed(() => (this.slot() ? 'Mettre à jour' : 'Créer'));
    isInThePast = computed(() => {
        const now = new Date();
        const event = this.event();
        return event ? new Date(event.StartTime) < now : false;
    });
    isCreating = computed(() => this.slot() === null);
    submitClicked = output<SlotCreate | SlotUpdate>();
    cancelClicked = output<void>();
    typeSlots = this.typeSlotsService.typeSlots;
    visibleConfirmDelete = signal(false);

    slotForm = computed<Structure>(() => {
        const event = this.event();
        const options = this.typeSlots();
        return {
            id: 'slotForm',
            name: 'slotForm',
            label: 'Créer un créneau',
            styleClass: '!w-full min-w-full',
            hideCancelButton: true,
            hideSubmitButton: true,
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
                            value: event?.ExtendedProps?.['slot']?.typeId ?? options[0]?.id ?? null,
                            valueFormatter: (option: any) => {
                                return this.slotTypePipe.transform(option.name);
                            }
                        },
                        {
                            id: 'dateFrom',
                            name: 'dateFrom',
                            type: 'date',
                            showTime: true,
                            timeOnly: true,
                            fullWidth: true,
                            label: 'Date de début',
                            stepMinute: 15,
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
                            stepMinute: 15,
                            fullWidth: true,
                            placeholder: 'Sélectionner la date de fin',
                            value: event?.EndTime ?? new Date()
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
        const newEvent = {
            ...formData.value.slotDetails,
            id: (this.slot() as any)?.id ?? undefined
        };
        this.submitClicked.emit(newEvent);
        this.visible.set(false);
    }

    async removeSlot() {
        try {
            const slotId = (this.slot() as SlotDetails | null)?.id;
            if (!slotId) {
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'ID du créneau manquant.' });
                return;
            }

            await firstValueFrom(this.slotWrapperService.removeSlotById(slotId));
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Le créneau a été supprimé avec succès.' });
            this.cancel();
        } catch (ex: any) {
            console.log('Erreur lors de la suppression du créneau : ', ex?.error);
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: (ex as any).error?.message ?? 'Une erreur est survenue lors de la suppression du créneau.' });
        }
    }

    cancel() {
        this.visible.set(false);
        this.cancelClicked.emit();
    }
}

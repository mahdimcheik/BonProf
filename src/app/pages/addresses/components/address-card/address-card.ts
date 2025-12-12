import { ConfirmModalComponent } from '@/pages/components/confirm-modal/confirm-modal.component';
import { MapBasic } from '@/pages/profile/components/address/map-basic';
import { AddressTypePipe } from '@/pages/shared/pipes/address-type-pipe';
import { AddressWrapperService } from '@/pages/shared/services/address-wrapper-service';
import { TeacherWrapperService } from '@/pages/shared/services/teacher-wrapper-service';
import { Component, computed, inject, model, output, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tooltip } from 'primeng/tooltip';
import { firstValueFrom } from 'rxjs';
import { AddressCreate, AddressDetails, AddressUpdate } from 'src/client';
import { AddressEdition } from '../address-edition/address-edition';
@Component({
    selector: 'bp-address-card',
    imports: [AddressEdition, MapBasic, Card, Button, Tooltip, ConfirmModalComponent],
    templateUrl: './address-card.html',
    providers: [AddressTypePipe]
})
export class AddressCard {
    addressWrapperService = inject(AddressWrapperService);
    teacherWrapperService = inject(TeacherWrapperService);
    messageService = inject(MessageService);

    editMode = model(true);
    address = model.required<AddressDetails>();
    showDeleteConfirm = signal(false);
    teacher = this.teacherWrapperService.teacherProfile;
    addressTypePipe = inject(AddressTypePipe);

    iconclass = computed(() => {
        const typeId = this.address().typeId;
        return `pi ${this.addressTypePipe.transform(typeId)} text-primary`;
    });

    needRefresh = output<boolean>();

    cancel() {
        this.editMode.set(false);
    }

    goEditMode() {
        this.editMode.set(true);
    }

    async editAddress(address: AddressDetails | AddressCreate | AddressUpdate) {
        try {
            const newAddress = await firstValueFrom(this.addressWrapperService.updateAddress(address as AddressUpdate));
            if (newAddress.data) {
                this.address.set(newAddress.data);
            }
        } finally {
            this.editMode.set(false);
        }
    }
    showConfirmModal() {
        this.showDeleteConfirm.set(true);
    }
    hideConfirmModal() {
        this.showDeleteConfirm.set(false);
    }

    async deleteAddress() {
        try {
            await firstValueFrom(this.addressWrapperService.deleteAddress(this.address().id));
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: "L'adresse a été supprimée avec succès." });
            this.needRefresh.emit(true);
        } finally {
            this.showDeleteConfirm.set(false);
        }
    }
}

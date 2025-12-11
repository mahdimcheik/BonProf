import { MapBasic } from '@/pages/profile/components/address/map-basic';
import { AddressWrapperService } from '@/pages/shared/services/address-wrapper-service';
import { TeacherWrapperService } from '@/pages/shared/services/teacher-wrapper-service';
import { Component, inject, model, output, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { AddressCreate, AddressDetails, AddressUpdate } from 'src/client';
import { AddressEdition } from '../address-edition/address-edition';
@Component({
    selector: 'bp-address-card',
    imports: [AddressEdition, MapBasic],
    templateUrl: './address-card.html'
})
export class AddressCard {
    addressWrapperService = inject(AddressWrapperService);
    teacherWrapperService = inject(TeacherWrapperService);
    messageService = inject(MessageService);

    editMode = model(true);
    address = model.required<AddressDetails>();
    showEditModal = signal(false);
    showDeleteConfirm = signal(false);
    teacher = this.teacherWrapperService.teacherProfile;

    needRefresh = output<boolean>();

    cancel() {
        this.showEditModal.set(false);
    }

    openEditModal() {
        this.showEditModal.set(true);
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

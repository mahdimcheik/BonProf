import { AddressCard } from '@/pages/profile/components/address-card/address-card';
import { AddressEdition } from '@/pages/profile/components/address-edition/address-edition';
import { SmartSectionComponent } from '@/pages/components/smart-section/smart-section.component';
import { AddressWrapperService } from '@/pages/shared/services/address-wrapper-service';
import { MainService } from '@/pages/shared/services/main.service';
import { Component, DestroyRef, inject, model, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Button, ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { firstValueFrom } from 'rxjs';
import { AddressCreate, AddressDetails, AddressUpdate } from 'src/client/models';

@Component({
    selector: 'bp-addresses-list',
    imports: [SmartSectionComponent, AddressEdition, AddressCard, Button, Card, ButtonModule],
    templateUrl: './addresses-list.html'
})
export class AddressesList {
    addressWrapperService = inject(AddressWrapperService);
    mainService = inject(MainService);
    messageService = inject(MessageService);
    activatedRoute = inject(ActivatedRoute);
    destroyRef = inject(DestroyRef);

    title = 'Liste des addresses';

    editMode = model(true);
    buttonIcon = model('pi pi-plus');
    showEditBox = signal(false);

    addresses = signal<AddressDetails[]>([]);

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {
        if (this.mainService?.userConnected()?.id == null) {
            this.addresses.set([]);
            return;
        }
        const addressesData = await firstValueFrom(this.addressWrapperService.getAddresses());
        this.addresses.set(addressesData.data || []);
    }

    async showAddAddressBox() {
        this.showEditBox.set(true);
    }

    hideAddAddressBox() {
        this.showEditBox.set(false);
    }

    cancel() {
        this.showEditBox.set(false);
    }

    async addNewAddress(event: AddressCreate | AddressDetails | AddressUpdate) {
        await firstValueFrom(this.addressWrapperService.addAddress(event as AddressCreate));
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Adresse ajoutée avec succès' });
        this.showEditBox.set(false);
        await this.loadData();
    }
}

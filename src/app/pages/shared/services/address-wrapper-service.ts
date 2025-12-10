import { inject, Injectable } from '@angular/core';
import { AddressCreate, AddressesService, AddressUpdate } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class AddressWrapperService {
    addressesService = inject(AddressesService);

    addAddress(address: AddressCreate) {
        return this.addressesService.addressesPost(address);
    }

    getAddresses() {
        return this.addressesService.addressesAllGet();
    }

    updateAddress(address: AddressUpdate) {
        return this.addressesService.addressesPut(address);
    }

    deleteAddress(addressId: string) {
        return this.addressesService.addressesIdDelete(addressId);
    }
}

import { inject, Injectable, signal } from '@angular/core';
import { map, of, tap } from 'rxjs';
import { AddressCreate, AddressesService, AddressUpdate, TypeAddressDetails, TypeAddressesService } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class AddressWrapperService {
    addressesService = inject(AddressesService);
    TypeAddressesService = inject(TypeAddressesService);

    typeAddresses = signal<TypeAddressDetails[]>([]);

    getAddressTypes() {
        if (!this.typeAddresses().length) {
            return this.TypeAddressesService.typeaddressesAllGet().pipe(
                tap((res) => this.typeAddresses.set(res?.data ?? [])),
                map((res) => res.data ?? [])
            );
        } else {
            return of(this.typeAddresses());
        }
    }

    addAddress(address: AddressCreate) {
        return this.addressesService.addressesPost(address);
    }

    getAddressesByUser() {
        return this.addressesService.addressesGet();
    }

    updateAddress(address: AddressUpdate) {
        return this.addressesService.addressesPut(address);
    }

    deleteAddress(addressId: string) {
        return this.addressesService.addressesIdDelete(addressId);
    }
}

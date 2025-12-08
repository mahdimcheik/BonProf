import { Component, inject, model } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AddressDetails } from 'src/client';

@Component({
    selector: 'bp-address',
    imports: [],
    templateUrl: './address.html'
})
export class Address {
    // addressMainService = inject(AddressesMainService);
    messageService = inject(MessageService);

    address = model.required<AddressDetails>();
}

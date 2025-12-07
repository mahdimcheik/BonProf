import { SmartElementComponent } from '@/pages/components/smart-element/smart-element.component';
import { Component, inject, model } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'bp-address',
    imports: [SmartElementComponent],
    templateUrl: './address.html'
})
export class Address {
    // addressMainService = inject(AddressesMainService);
    messageService = inject(MessageService);

    address = model.required<any>();
}

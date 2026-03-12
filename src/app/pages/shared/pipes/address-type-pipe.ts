import { Pipe, PipeTransform } from '@angular/core';
import { AddressTypeEnum } from 'src/client';

@Pipe({
    name: 'addressType'
})
export class AddressTypePipe implements PipeTransform {
    transform(value: unknown, ...args: unknown[]): string {
        if (typeof value === 'string') {
            if (value.trim().toLowerCase() === 'e1fee3ea-6190-48c3-8e40-c1f053fea79d') {
                return 'pi-home';
            }
            if (value.trim().toLowerCase() === 'b8b8a8fc-ca60-440b-815f-1e44b89c9803') {
                return 'pi-briefcase';
            }
        }
        return 'pi-map-marker';
    }
}

@Pipe({
    name: 'addressTypeName'
})
export class AddressTypeNamePipe implements PipeTransform {
    transform(value: unknown, ...args: unknown[]): string {
        if (typeof value === 'string') {
            if (value.trim() === AddressTypeEnum.Billing) {
                return 'Facturation';
            }
            if (value.trim() === AddressTypeEnum.Main) {
                return 'Principale';
            }
        }
        return 'Générique';
    }
}

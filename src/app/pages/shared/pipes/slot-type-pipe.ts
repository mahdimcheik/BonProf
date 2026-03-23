import { Pipe, PipeTransform } from '@angular/core';
import { SlotTypeEnum } from 'src/client';

@Pipe({
    name: 'slotType'
})
export class SlotTypePipe implements PipeTransform {
    transform(value: unknown, ...args: unknown[]): unknown {
        if (!value || typeof value !== 'string') return null;
        if (value == SlotTypeEnum.All) return 'Tous';
        if (value == SlotTypeEnum.Presential) return 'Présentiel';
        if (value == SlotTypeEnum.Visio) return 'En ligne';
        return null;
    }
}

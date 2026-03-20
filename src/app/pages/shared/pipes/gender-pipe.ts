import { Pipe, PipeTransform } from '@angular/core';
import { GenderEnum } from 'src/client';

@Pipe({
    name: 'gender'
})
export class GenderPipe implements PipeTransform {
    transform(value: unknown, ...args: unknown[]): unknown {
        if (!value || typeof value !== 'string') return null;
        if (value == GenderEnum.Female) return 'Femme';
        if (value == GenderEnum.Male) return 'Homme';
        if (value == GenderEnum.Other) return 'Autre';
        return null;
    }
}

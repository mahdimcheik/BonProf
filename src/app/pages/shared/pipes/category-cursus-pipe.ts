import { Pipe, PipeTransform } from '@angular/core';
import { CursusCategoryEnum } from 'src/client';

@Pipe({
  name: 'categoryCursus'
})
export class CategoryCursusPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (!value || typeof value !== 'string') return null;
    if (value == CursusCategoryEnum.Back) return 'Back-end';
    if (value == CursusCategoryEnum.Front) return 'Front-end';
    if (value == CursusCategoryEnum.Soft) return 'Soft skills';
    if (value == CursusCategoryEnum.Technics) return 'Techniques';
    return null;
  }

}

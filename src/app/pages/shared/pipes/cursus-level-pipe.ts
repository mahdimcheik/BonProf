import { Pipe, PipeTransform } from '@angular/core';
import { CursusLevelEnum } from 'src/client';

@Pipe({
  name: 'cursusLevel'
})
export class CursusLevelPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (!value || typeof value !== 'string') return null;
    if (value == CursusLevelEnum.All) return 'Tous';
    if (value == CursusLevelEnum.Advanced) return 'Avancé';
    if (value == CursusLevelEnum.Beginner) return 'Débutant';
    if (value == CursusLevelEnum.Intermediate) return 'Intermédiaire';

    return null;
  }

}

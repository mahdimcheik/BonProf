import { inject, Injectable, signal } from '@angular/core';
import { map, of, tap } from 'rxjs';
import { GenderDetails, GendersService } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class GenderWrapperService {
    genderService = inject(GendersService);
    genders = signal<GenderDetails[]>([]);

    getGenders() {
        if (this.genders.length > 0) {
            return of(this.genders());
        }
        return this.genderService.gendersAllGet().pipe(
            map((response) => response.data),
            tap((res) => {
                this.genders.set(res ?? []);
            })
        );
    }
}

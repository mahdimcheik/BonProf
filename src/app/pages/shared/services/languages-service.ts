import { inject, Injectable, signal } from '@angular/core';
import { map, of } from 'rxjs';
import { LanguageDetails, LanguagesService } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class LanguagesWrapperService {
    languagesService = inject(LanguagesService);
    languagesList = signal<LanguageDetails[]>([]);

    getAvailableLanguages(forceRefetch: boolean = false) {
        if (this.languagesList().length > 0 && !forceRefetch) {
            return of(this.languagesList());
        }
        return this.languagesService.languagesAllPost().pipe(
            map((response) => {
                if (response.data) {
                    this.languagesList.set(response.data);
                }
                return response.data ?? [];
            })
        );
    }
}

import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { map, of, tap } from 'rxjs';
import { FormationDetails, LanguageDetails, LanguagesService, TeacherDetails, TeacherProfileService, TeacherProfileUpdate } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class TeacherWrapperService {
    teacherService = inject(TeacherProfileService);
    languagesService = inject(LanguagesService);
    teacherProfile = signal<TeacherDetails | null>(null);
    formationList = linkedSignal<FormationDetails[]>(() => this.teacherProfile()?.formations ?? []);
    languagesList = signal<LanguageDetails[]>([]);

    getTeacherFullProfile() {
        return this.teacherService.teacherprofileMyProfileGet().pipe(
            tap((response) => {
                if (response.data) {
                    this.teacherProfile.set(response.data);
                }
            })
        );
    }

    updateTeacherProfile(updatedProfile: TeacherProfileUpdate) {
        return this.teacherService.teacherprofilePut(updatedProfile);
    }

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

import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { LanguagesService, TeacherDetails, TeacherProfileService, TeacherProfileUpdate } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class TeacherWrapperService {
    teacherService = inject(TeacherProfileService);
    languagesService = inject(LanguagesService);
    teacherProfile = signal<TeacherDetails | null>(null);

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
}

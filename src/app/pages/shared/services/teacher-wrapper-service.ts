import { inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { LanguagesService, ProfileDetails, TeacherProfileService } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class TeacherWrapperService {
    teacherProfileService = inject(TeacherProfileService);
    languagesService = inject(LanguagesService);
    teacher = signal<ProfileDetails | null>(null);

    getTeacherFullProfile() {
        return this.teacherProfileService.teacherprofileMyProfileGet().pipe(
            map((response) => response.data),
            tap((response) => {
                if (response) {
                    this.teacher.set(response);
                }
            })
        );
    }

    // updateTeacherProfile(updatedProfile: TeacherUpdate) {
    //     return this.teacherService.teacherprofilePut(updatedProfile);
    // }
}

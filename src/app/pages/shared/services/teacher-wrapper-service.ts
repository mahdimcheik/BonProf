import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { LanguagesService, TeacherDetails, TeachersService, TeacherUpdate, UserDetails } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class TeacherWrapperService {
    teacherService = inject(TeachersService);
    languagesService = inject(LanguagesService);
    teacherProfile = signal<UserDetails | null>(null);

    getTeacherFullProfile() {
        // return this.teacherService.teachersMyProfileGet().pipe(
        //     tap((response) => {
        //         if (response.data) {
        //             this.teacherProfile.set(response.data.teacher ?? null);
        //         }
        //     })
        // );
    }

    updateTeacherProfile(updatedProfile: TeacherUpdate) {
        return this.teacherService.teachersUpdateProfilePut(updatedProfile);
    }
}

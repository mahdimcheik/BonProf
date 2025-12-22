import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { LanguagesService, TeachersService, UserDetails } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class TeacherWrapperService {
    teacherService = inject(TeachersService);
    languagesService = inject(LanguagesService);
    teacher = signal<UserDetails | null>(null);

    getTeacherFullProfile() {
        return this.teacherService.teachersMyProfileGet().pipe(
            tap((response) => {
                if (response.data) {
                    this.teacher.set(response.data);
                }
            })
        );
    }

    // updateTeacherProfile(updatedProfile: TeacherProfileUpdate) {
    //     return this.teacherService.teacherprofilePut(updatedProfile);
    // }
}

import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { tap } from 'rxjs';
import { FormationDetails, TeacherDetails, TeacherProfileService, TeacherProfileUpdate } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class TeacherWrapperService {
    teacherService = inject(TeacherProfileService);
    teacherProfile = signal<TeacherDetails | null>(null);
    formationList = linkedSignal<FormationDetails[]>(() => this.teacherProfile()?.formations ?? []);

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

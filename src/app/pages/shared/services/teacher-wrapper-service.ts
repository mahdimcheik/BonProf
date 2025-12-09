import { inject, Injectable } from '@angular/core';
import { TeacherProfileService } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class TeacherWrapperService {
    teacherService = inject(TeacherProfileService);

    getTeacherFullProfile() {
        return this.teacherService.teacherprofileMyProfileGet();
    }
}

import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { FilterTeacher, TeachersService } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class TeacherWrapperService {
    teacherService = inject(TeachersService);

    getTeachers(filters: FilterTeacher) {
        return this.teacherService.teachersAllPost(filters).pipe(map((response) => response.data ?? []));
    }
}

import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { FilterTeacher, TeachersService } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class TeacherWrapperService {
    teacherService = inject(TeachersService);

    getTeachers(filters: FilterTeacher) {
        return this.teacherService.teachersAllPost(filters);
    }

    getPrivacyDocuments() {
        return this.teacherService.teachersGetDocumentsGet().pipe(map((response) => response.data));
    }

    uploadDocument(file: File, typeId: string, title: string) {
        return this.teacherService.teachersUploadDocumentPost(title, typeId, file);
    }
}

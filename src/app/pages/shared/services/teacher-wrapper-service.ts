import { inject, Injectable, signal } from '@angular/core';
import { map, of, tap } from 'rxjs';
import { FilterTeacher, PrivacyDocumentTypeDetails, TeachersService } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class TeacherWrapperService {
    teacherService = inject(TeachersService);
    types = signal<PrivacyDocumentTypeDetails[]>([]);

    getTeachers(filters: FilterTeacher) {
        return this.teacherService.teachersAllPost(filters);
    }

    getPrivacyDocuments() {
        return this.teacherService.teachersGetDocumentsGet().pipe(map((response) => response.data));
    }

    uploadDocument(file: File, typeId: string, title: string) {
        return this.teacherService.teachersUploadDocumentPost(title, typeId, file);
    }

    getDocumentTypes() {
        if (this.types().length > 0) {
            return of(this.types());
        }
        return this.teacherService.teachersDocumentTypesGet().pipe(
            map((response) => response.data),
            tap((types) => this.types.set(types ?? []))
        );
    }
}

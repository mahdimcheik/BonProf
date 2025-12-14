import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { CursusCreate, CursusService } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class CursusWrapperService {
    cursusService = inject(CursusService);

    addCurus(cursus: CursusCreate) {
        return this.cursusService.cursusCreatePost(cursus);
    }

    getCursus() {
        return this.cursusService.cursusAllGet();
    }

    getCursusById(cursusId: string) {
        return this.cursusService.cursusIdGet(cursusId).pipe(map((response) => response.data));
    }

    getCursusByTeacher(teacherId: string) {
        return this.cursusService.cursusTeacherIdGet(teacherId).pipe(map((response) => response.data));
    }

    delteCursus(cursusId: string) {
        return this.cursusService.cursusIdDelete(cursusId);
    }
}

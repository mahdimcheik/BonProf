import { inject, Injectable, signal } from '@angular/core';
import { map, of, tap } from 'rxjs';
import { CategoryCursusDetails, CategoryCursusService, CursusCreate, CursusService, CursusUpdate, LevelCursusDetails, LevelCursusService } from 'src/client';

@Injectable({
    providedIn: 'root'
})
export class CursusWrapperService {
    cursusService = inject(CursusService);
    levelCursusService = inject(LevelCursusService);
    categoryCursusService = inject(CategoryCursusService);

    categoryCursuses = signal<CategoryCursusDetails[]>([]);
    levelCursuses = signal<LevelCursusDetails[]>([]);

    addCurus(cursus: CursusCreate) {
        return this.cursusService.cursusCreatePost(cursus);
    }

    updateCursus(cursus: CursusUpdate) {
        return this.cursusService.cursusPut(cursus);
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

    // levels et categories
    getCursusLevels(forceFetch: boolean = false) {
        if (this.levelCursuses().length) {
            return of(this.levelCursuses());
        }
        return this.levelCursusService.levelcursusAllGet().pipe(
            tap((response) => {
                this.levelCursuses.set(response.data || []);
            }),
            map((res) => res.data || [])
        );
    }

    getCategories(forceFetch: boolean = false) {
        if (this.categoryCursuses().length > 0 && !forceFetch) {
            return of(this.categoryCursuses());
        }
        return this.categoryCursusService.categorycursusAllGet().pipe(
            tap((response) => {
                this.categoryCursuses.set(response.data || []);
            }),
            map((res) => res.data || [])
        );
    }
}

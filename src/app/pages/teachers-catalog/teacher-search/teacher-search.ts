import { Component, inject, model, OnInit, signal } from '@angular/core';
import { FilterTeacher, UserDetails } from 'src/client';
import { TeacherCard } from '../teacher-card/teacher-card';
import { TeacherWrapperService } from '@/pages/shared/services/teacher-wrapper-service';
import { firstValueFrom } from 'rxjs';
import { Card } from 'primeng/card';

@Component({
    selector: 'bp-teacher-search',
    imports: [TeacherCard, Card],
    templateUrl: './teacher-search.html'
})
export class TeacherSearch implements OnInit {
    teacherService = inject(TeacherWrapperService);
    teachers = signal<UserDetails[]>([]);

    ngOnInit(): void {
        this.loadData();
    }

    async loadData() {
        const filters: FilterTeacher = {
            // city: string | null;
            // postalCode?: string | null;
            // dateFrom?: Date | null;
            // dateTo?: Date | null;
            fullName: 'Mah',
            categoryIds: [],
            levelIds: [],
            first: 0,
            row: 10
        };
        const data = await firstValueFrom(this.teacherService.getTeachers(filters));
        this.teachers.set(data);
    }
}

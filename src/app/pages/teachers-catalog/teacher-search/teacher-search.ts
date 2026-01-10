import { Component, inject, model, OnInit, signal } from '@angular/core';
import { FilterTeacher, UserDetails, CategoryCursus, LevelCursus } from 'src/client';
import { TeacherCard } from '../teacher-card/teacher-card';
import { TeacherWrapperService } from '@/pages/shared/services/teacher-wrapper-service';
import { firstValueFrom } from 'rxjs';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelect } from 'primeng/multiselect';
import { Button } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'bp-teacher-search',
    imports: [TeacherCard, Card, InputText, DatePickerModule, MultiSelect, Button, FormsModule],
    styleUrls: ['./teacher-search.scss'],
    templateUrl: './teacher-search.html'
})
export class TeacherSearch implements OnInit {
    teacherService = inject(TeacherWrapperService);
    teachers = signal<UserDetails[]>([]);

    // Filter properties
    fullName = signal<string | null>(null);
    city = signal<string | null>(null);
    postalCode = signal<string | null>(null);
    dateFrom = signal<Date | null>(null);
    dateTo = signal<Date | null>(null);
    selectedCategories = signal<string[]>([]);
    selectedLevels = signal<string[]>([]);

    // Mock data - Replace with actual service calls
    categories = signal<CategoryCursus[]>([
        { id: '1', name: 'Mathématiques', color: '#3b82f6', createdAt: new Date(), updatedAt: null, archivedAt: null },
        { id: '2', name: 'Physique', color: '#10b981', createdAt: new Date(), updatedAt: null, archivedAt: null },
        { id: '3', name: 'Chimie', color: '#f59e0b', createdAt: new Date(), updatedAt: null, archivedAt: null },
        { id: '4', name: 'Informatique', color: '#8b5cf6', createdAt: new Date(), updatedAt: null, archivedAt: null }
    ]);

    levels = signal<LevelCursus[]>([
        { id: '1', name: 'Débutant', color: '#22c55e', createdAt: new Date(), updatedAt: null, archivedAt: null },
        { id: '2', name: 'Intermédiaire', color: '#eab308', createdAt: new Date(), updatedAt: null, archivedAt: null },
        { id: '3', name: 'Avancé', color: '#ef4444', createdAt: new Date(), updatedAt: null, archivedAt: null }
    ]);

    ngOnInit(): void {
        this.loadData();
    }

    async loadData() {
        const filters: FilterTeacher = {
            fullName: this.fullName(),
            city: this.city(),
            postalCode: this.postalCode(),
            dateFrom: this.dateFrom(),
            dateTo: this.dateTo(),
            categoryIds: this.selectedCategories(),
            levelIds: this.selectedLevels(),
            first: 0,
            row: 10
        };
        const data = await firstValueFrom(this.teacherService.getTeachers(filters));
        this.teachers.set(data);
    }

    async onSearch() {
        await this.loadData();
    }

    clearFilters() {
        this.fullName.set(null);
        this.city.set(null);
        this.postalCode.set(null);
        this.dateFrom.set(null);
        this.dateTo.set(null);
        this.selectedCategories.set([]);
        this.selectedLevels.set([]);
        this.loadData();
    }
}

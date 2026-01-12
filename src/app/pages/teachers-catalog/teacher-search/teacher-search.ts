import { Component, computed, inject, model, OnDestroy, OnInit, signal } from '@angular/core';
import { FilterTeacher, UserDetails, CategoryCursus, LevelCursus, AddressCreate } from 'src/client';
import { TeacherCard } from '../teacher-card/teacher-card';
import { TeacherWrapperService } from '@/pages/shared/services/teacher-wrapper-service';
import { debounceTime, firstValueFrom, Subject } from 'rxjs';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelect } from 'primeng/multiselect';
import { Button, ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { LuxonModule } from 'luxon-angular';
import { DateTime } from 'luxon';
import { DatePipe } from '@angular/common';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { CityDetails } from '@/pages/shared/models/geolocalisation';
import { HttpClient } from '@angular/common/http';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { MainService } from '@/pages/shared/services/main.service';

@Component({
    selector: 'bp-teacher-search',
    imports: [TeacherCard, Card, InputText, DatePickerModule, MultiSelect, AutoCompleteModule, FormsModule, ButtonModule, LuxonModule, DatePipe, PaginatorModule],
    styleUrls: ['./teacher-search.scss'],
    templateUrl: './teacher-search.html'
})
export class TeacherSearch implements OnInit {
    mainService = inject(MainService);
    teacherService = inject(TeacherWrapperService);
    http = inject(HttpClient);
    teachers = signal<UserDetails[]>([]);

    // Filter properties
    fullName = signal<string | null>(null);
    selectedCity = this.mainService.selectedCity;
    cities = signal<CityDetails[]>([]);
    material = signal<string | null>(null);
    postalCode = signal<string | null>(null);
    selectedCategories = signal<string[]>([]);
    selectedLevels = signal<string[]>([]);

    first = signal<number>(0);
    rows = signal<number>(5);
    totalRecords = signal<number>(0);

    SelectedDate = signal<DateTime>(DateTime.now());
    weekNumber = computed(() => this.SelectedDate().weekNumber);
    dateFrom = computed<Date | null>(() => {
        if (this.SelectedDate() == DateTime.now()) {
            return this.SelectedDate().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toJSDate();
        }
        const weekStart = this.SelectedDate().set({ weekday: 1 }).startOf('day');
        return weekStart.toJSDate();
    });
    dateTo = computed<Date | null>(() => {
        const weekEnd = this.SelectedDate().set({ weekday: 7 }).endOf('day');
        return weekEnd.toJSDate();
    });

    canClick = computed(() => {
        console.log(this.SelectedDate() > DateTime.now());
        return this.SelectedDate() > DateTime.now();
    });
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
            city: this.selectedCity()?.properties.city || null,
            postalCode: this.postalCode(),
            dateFrom: this.dateFrom(),
            dateTo: this.dateTo(),
            categoryIds: this.selectedCategories(),
            levelIds: this.selectedLevels(),
            first: this.first(),
            row: this.rows()
        };
        const data = await firstValueFrom(this.teacherService.getTeachers(filters));
        this.teachers.set(data?.data ?? []);
        this.totalRecords.set(data?.count ?? 0);
    }

    async onSearch() {
        this.first.set(0);
        this.rows.set(5);
        await this.loadData();
    }

    clearFilters() {
        this.fullName.set(null);
        this.selectedCity.set(null);
        this.postalCode.set(null);
        this.selectedCategories.set([]);
        this.selectedLevels.set([]);
        this.first.set(0);
        this.rows.set(5);
        this.loadData();
    }

    onPageChange($event: PaginatorState) {
        this.first.set($event.first ?? 0);
        this.rows.set($event.rows ?? 5);
        this.loadData();
    }

    nextWeek() {
        this.SelectedDate.set(this.SelectedDate().plus({ weeks: 1 }));
        this.loadData();
    }

    previousWeek() {
        this.SelectedDate.set(this.SelectedDate().minus({ weeks: 1 }));
        this.loadData();
    }

    async search(event: AutoCompleteCompleteEvent) {
        const response = await firstValueFrom(this.http.get<any>(`https://api-adresse.data.gouv.fr/search/?q=${event.query}&type=municipality`, { withCredentials: false }));

        const citiesWithLabel = response.features.map((city: CityDetails) => ({
            ...city,
            displayLabel: `${city.properties.postcode} ${city.properties.city}`
        }));

        this.cities.set(citiesWithLabel);
    }

    onCitySelect(event: any) {
        if (event.value) {
            this.postalCode.set(event.value.properties.postcode);
            this.selectedCity.set(event.value);
        }
    }
}

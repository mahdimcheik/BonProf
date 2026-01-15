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
import { CursusWrapperService } from '@/pages/shared/services/cursus-wrapper-service';
import { Slider } from 'primeng/slider';

@Component({
    selector: 'bp-teacher-search',
    imports: [TeacherCard, Card, InputText, DatePickerModule, MultiSelect, AutoCompleteModule, FormsModule, ButtonModule, LuxonModule, DatePipe, PaginatorModule, Slider],
    styleUrls: ['./teacher-search.scss'],
    templateUrl: './teacher-search.html'
})
export class TeacherSearch implements OnInit {
    mainService = inject(MainService);
    teacherService = inject(TeacherWrapperService);
    cursusWrapperService = inject(CursusWrapperService);
    http = inject(HttpClient);

    teachers = signal<UserDetails[]>([]);

    // Filter properties
    selectedCity = this.mainService.selectedCity;
    cities = signal<CityDetails[]>([]);
    postalCode = signal<string | null>(null);
    long = signal<number | null>(null);
    lat = signal<number | null>(null);
    radius = signal<number>(10);

    fullName = signal<string | null>(null);
    cursusName = signal<string | null>(null);
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

    levels = this.cursusWrapperService.levelCursuses;

    ngOnInit(): void {
        if (this.selectedCity()) {
            this.postalCode.set(this.selectedCity()?.properties?.postcode || null);
            this.lat.set(this.selectedCity()?.geometry.coordinates[1] || null);
            this.long.set(this.selectedCity()?.geometry.coordinates[0] || null);
        }
        this.loadData();
    }

    async loadData() {
        const filters: FilterTeacher = {
            fullName: this.fullName(),
            city: this.selectedCity()?.properties?.city || null,
            postalCode: this.postalCode(),
            dateFrom: this.dateFrom(),
            dateTo: this.dateTo(),
            cursusName: this.cursusName(),
            categoryIds: this.selectedCategories(),
            levelIds: this.selectedLevels(),
            first: this.first(),
            row: this.rows(),
            long: this.long(),
            lat: this.lat(),
            radius: this.radius()
        };
        await firstValueFrom(this.cursusWrapperService.getCursusLevels());

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
            this.lat.set(event.value.geometry.coordinates[1]);
            this.long.set(event.value.geometry.coordinates[0]);
        } else {
            this.postalCode.set(null);
            this.selectedCity.set(null);
        }
    }
    onclear() {
        this.postalCode.set(null);
        this.lat.set(null);
        this.long.set(null);
    }

    // distance input handler to prevent letters
    setInput(event: any) {
        const input = event.target.value;
        const numericValue = input.replace(/[^0-9]/g, '');
        this.radius.set(numericValue ? parseInt(numericValue, 10) : 10);
        if (this.radius() < 10 || this.radius() > 100) {
            this.radius.set(10);
        }
    }
}

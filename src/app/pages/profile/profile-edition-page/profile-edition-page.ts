import { CalendarEvent } from '@/pages/shared/models/calendarModels';
import { TeacherWrapperService } from '@/pages/shared/services/teacher-wrapper-service';
import { CalendarTeacher } from '@/pages/slots/calendar-teacher/calendar-teacher';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { AddressesList } from '../components/addresses/addresses-list/addresses-list';
import { CursusesList } from '../components/cursuses/cursuses-list/cursuses-list';
import { FormationsList } from '../components/formations/formations-list/formations-list';
import { PersonnalInfosEdition } from '../components/personnal-infos-edition/personnal-infos-edition';
import { ProductsList } from '../components/products/products-list/products-list';

@Component({
    selector: 'bp-profile-edition-page',
    imports: [TabsModule, FormationsList, AddressesList, CursusesList, ProductsList, CalendarTeacher, PersonnalInfosEdition],
    templateUrl: './profile-edition-page.html'
})
export class ProfileEditionPage implements OnInit {
    teacherWrapperService = inject(TeacherWrapperService);
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);
    tab: string = 'personnalInfos';
    events: CalendarEvent[] = [];

    ngOnInit() {
        this.teacherWrapperService.getTeacherFullProfile().subscribe();
        this.activatedRoute.queryParams.subscribe((params) => {
            const tabParam = params['tab'];
            if (tabParam) {
                this.tab = tabParam;
            } else {
                this.tab = 'personnalInfos';
            }
        });
    }

    onTabChange(tabValue: string | number | undefined) {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { tab: tabValue },
            queryParamsHandling: 'merge'
        });
    }
}

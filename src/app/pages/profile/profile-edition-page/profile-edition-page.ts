import { TeacherWrapperService } from '@/pages/shared/services/teacher-wrapper-service';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { AddressesList } from '../components/addresses-list/addresses-list';
import { CursusesList } from '../components/cursuses-list/cursuses-list';
import { FormationsList } from '../components/formations-list/formations-list';
import { PersonnalInfosEdition } from '../components/personnal-infos-edition/personnal-infos-edition';
import { ProductsList } from '../components/products-list/products-list';

@Component({
    selector: 'bp-profile-edition-page',
    imports: [TabsModule, PersonnalInfosEdition, FormationsList, AddressesList, CursusesList, ProductsList],
    templateUrl: './profile-edition-page.html'
})
export class ProfileEditionPage implements OnInit {
    teacherWrapperService = inject(TeacherWrapperService);
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);
    tab: string = 'personnalInfos';

    ngOnInit() {
        this.teacherWrapperService.getTeacherFullProfile();
        // .subscribe();
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

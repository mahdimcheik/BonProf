import { MainService } from '@/pages/shared/services/main.service';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { AddressesList } from '../components/addresses-list/addresses-list';
import { FormationsList } from '../components/formations-list/formations-list';
import { PersonnalInfosEdition } from '../components/personnal-infos-edition/personnal-infos-edition';
import { ProfilePage } from "../profile-page/profile-page";
import { ProfileStudent } from "../profile-student/profile-student";

@Component({
    selector: 'bp-profile-edition-page',
    imports: [TabsModule, PersonnalInfosEdition, FormationsList, AddressesList, ProfilePage, ProfileStudent],
    templateUrl: './profile-edition-page.html'
})
export class ProfileEditionPage implements OnInit {
    mainService = inject(MainService);
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);
    tab: string = 'preview';

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params) => {
            const tabParam = params['tab'];
            if (tabParam) {
                this.tab = tabParam;
            } else {
                this.tab = 'preview';
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

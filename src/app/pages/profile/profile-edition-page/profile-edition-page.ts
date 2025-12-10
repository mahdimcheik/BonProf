import { TeacherWrapperService } from '@/pages/shared/services/teacher-wrapper-service';
import { Component, inject, OnInit } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { AddressesList } from '../components/addresses-list/addresses-list';
import { FormationsList } from '../components/formations-list/formations-list';
import { PersonnalInfosEdition } from '../components/personnal-infos-edition/personnal-infos-edition';

@Component({
    selector: 'bp-profile-edition-page',
    imports: [TabsModule, PersonnalInfosEdition, FormationsList, AddressesList],
    templateUrl: './profile-edition-page.html'
})
export class ProfileEditionPage implements OnInit {
    teacherWrapperService = inject(TeacherWrapperService);

    ngOnInit() {
        this.teacherWrapperService.getTeacherFullProfile().subscribe();
    }
}

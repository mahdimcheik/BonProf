import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { FormationDetails } from 'src/client';
import { FormationsList } from '../components/formations-list/formations-list';
import { PersonnalInfosEdition } from '../components/personnal-infos-edition/personnal-infos-edition';

@Component({
    selector: 'bp-profile-edition-page',
    imports: [TabsModule, PersonnalInfosEdition, FormationsList],
    templateUrl: './profile-edition-page.html'
})
export class ProfileEditionPage {
    formation: FormationDetails = {
        id: '1',
        title: 'formation 1',
        description: 'Description de la formation 1',
        institute: 'Institut 1',
        dateFrom: new Date(),
        dateTo: null,
        createdAt: new Date(),
        updatedAt: null,
        teacher: undefined
    };
}

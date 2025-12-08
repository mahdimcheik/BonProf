import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { FormationsEdition } from '../components/formations-edition/formations-edition';
import { PersonnalInfosEdition } from '../components/personnal-infos-edition/personnal-infos-edition';

@Component({
    selector: 'bp-profile-edition-page',
    imports: [TabsModule, PersonnalInfosEdition, FormationsEdition],
    templateUrl: './profile-edition-page.html'
})
export class ProfileEditionPage {}

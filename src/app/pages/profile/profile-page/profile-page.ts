import { ContactForm } from '@/pages/components/contact-form/contact-form';
import { Component } from '@angular/core';
import { Divider } from 'primeng/divider';
import { UserDetails } from 'src/client';
import { ProfileDescription } from '../components/profile-description/profile-description';
import { ProfileInfos } from '../components/profile-infos/profile-infos';

@Component({
    selector: 'bp-profile-page',
    imports: [ProfileInfos, Divider, ProfileDescription, ContactForm],
    templateUrl: './profile-page.html'
})
export class ProfilePage {
    teacherprofile: UserDetails = {
        id: 'mahdi-id',
        email: 'mahdi@mahdi.com',
        firstName: 'First name',
        lastName: 'Last name',
        imgUrl: '',
        roles: []
    };
}

import { ContactForm } from '@/pages/components/contact-form/contact-form';
import { Component } from '@angular/core';
import { Divider } from 'primeng/divider';
import { AddressDetails, UserDetails } from 'src/client';
import { Address } from '../components/address/address';
import { MapBasic } from '../components/address/map-basic';
import { ProfileDescription } from '../components/profile-description/profile-description';
import { ProfileInfos } from '../components/profile-infos/profile-infos';

@Component({
    selector: 'bp-profile-page',
    imports: [ProfileInfos, Divider, ProfileDescription, ContactForm, Address, MapBasic],
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

    address: AddressDetails = {
        id: 'address-id',
        street: '67 avenue de paris',
        city: 'Chevanceaux',
        state: 'Charente-Maritime',
        zipCode: '17210',
        country: 'France',
        latitude: 45.301912,
        longitude: -0.235181,
        createdAt: new Date()
    };
    address1: AddressDetails = {
        id: 'address-id',
        street: '67 avenue de paris',
        city: 'Chevanceaux',
        state: 'Charente-Maritime',
        zipCode: '17210',
        country: 'France',
        latitude: 46.301912,
        longitude: -0.235181,
        createdAt: new Date()
    };
}

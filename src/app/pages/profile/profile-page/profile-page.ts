import { ContactForm } from '@/pages/components/contact-form/contact-form';
import { TeacherWrapperService } from '@/pages/shared/services/teacher-wrapper-service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Divider } from 'primeng/divider';
import { firstValueFrom } from 'rxjs';
import { AddressDetails, TeacherDetails } from 'src/client';
import { Address } from '../components/address/address';
import { MapBasic } from '../components/address/map-basic';
import { ProfileDescription } from '../components/profile-description/profile-description';
import { ProfileInfos } from '../components/profile-infos/profile-infos';

@Component({
    selector: 'bp-profile-page',
    imports: [ProfileInfos, Divider, ProfileDescription, ContactForm, Address, MapBasic],
    templateUrl: './profile-page.html'
})
export class ProfilePage implements OnInit {
    teacherWrapperService = inject(TeacherWrapperService);
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);
    teacherprofile = signal<TeacherDetails | null>(null);

    address: AddressDetails = {
        id: 'address-id',
        street: '67 avenue de paris',
        city: 'Chevanceaux',
        zipCode: '17210',
        country: 'France',
        latitude: 45.301912,
        longitude: -0.235181,
        createdAt: new Date(),
        typeId: '1'
    };
    address1: AddressDetails = {
        id: 'address-id',
        street: '67 avenue de paris',
        city: 'Chevanceaux',
        zipCode: '17210',
        country: 'France',
        latitude: 46.301912,
        longitude: -0.235181,
        typeId: '1',
        createdAt: new Date()
    };

    ngOnInit() {
        const routeData = this.activatedRoute.params.subscribe((params) => {
            const teacherId = params['id'];
            this.loadData(teacherId);
        });
    }

    async loadData(teacherId: string) {
        if (teacherId === 'me') {
            const teacherData = await firstValueFrom(this.teacherWrapperService.getTeacherFullProfile());
            if (teacherData.data) {
                this.teacherprofile.set(teacherData.data);
            }
        }
    }
}

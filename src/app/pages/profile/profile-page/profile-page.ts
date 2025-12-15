import { ContactForm } from '@/pages/components/contact-form/contact-form';
import { TeacherWrapperService } from '@/pages/shared/services/teacher-wrapper-service';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { firstValueFrom } from 'rxjs';
import { TeacherDetails } from 'src/client';
import { Address } from '../components/addresses/address/address';
import { MapBasic } from '../components/addresses/address/map-basic';
import { ProfileDescription } from '../components/profile-description/profile-description';
import { ProfileInfos } from '../components/profile-infos/profile-infos';

@Component({
    selector: 'bp-profile-page',
    imports: [ProfileInfos, Divider, ProfileDescription, ContactForm, Address, MapBasic, Card],
    templateUrl: './profile-page.html'
})
export class ProfilePage implements OnInit {
    teacherWrapperService = inject(TeacherWrapperService);
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);
    teacherprofile = signal<TeacherDetails | null>(null);
    mainAddress = computed(() => {
        return this.teacherprofile()?.user.addresses[0] || null;
    });

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

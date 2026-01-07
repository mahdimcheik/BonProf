import { ContactForm } from '@/pages/components/contact-form/contact-form';
// import { TeacherWrapperService } from '@/pages/shared/services/teacher-wrapper-service';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { firstValueFrom } from 'rxjs';
import { TeacherDetails, UserDetails } from 'src/client';
import { Address } from '../components/address/address';
import { MapBasic } from '../components/address/map-basic';
import { ProfileDescription } from '../components/profile-description/profile-description';
import { ProfileInfos } from '../components/profile-infos/profile-infos';
import { CursusesList } from '../components/cursuses-list/cursuses-list';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MainService } from '@/pages/shared/services/main.service';
import { AddressCard } from '@/pages/addresses/components/address-card/address-card';

@Component({
    selector: 'bp-profile-page',
    imports: [ProfileInfos, Divider, ProfileDescription, ContactForm, Address, MapBasic, Card, CursusesList, AddressCard],
    templateUrl: './profile-page.html'
})
export class ProfilePage implements OnInit {
    mainservice = inject(MainService);
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);
    teacherprofile = signal<UserDetails | null>(null);
    destroyRef = inject(DestroyRef);
    mainAddress = computed(() => {
        return this.teacherprofile()?.addresses[0] || null;
    });
    isOwner = false;

    ngOnInit() {
        const routeData = this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const teacherId = params['id'];
            this.loadData(teacherId);
            if (teacherId === 'me') {
                this.isOwner = true;
            } else {
                this.isOwner = false;
            }
        });
    }

    async loadData(teacherId: string) {
        if (teacherId === 'me') {
            const teacherData = await firstValueFrom(this.mainservice.getTeacherFullProfile());
            if (teacherData.data) {
                this.teacherprofile.set(teacherData.data);
            }
        }
    }
}

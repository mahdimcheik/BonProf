import { Component, DestroyRef, inject, signal } from '@angular/core';
import { UserDetails } from 'src/client';
import { ProfileDescription } from '../components/profile-description/profile-description';
import { Divider } from 'primeng/divider';
import { ContactForm } from '@/pages/components/contact-form/contact-form';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '@/pages/shared/services/main.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProfileInfos } from '../components/profile-infos/profile-infos';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'bp-profile-student',
    imports: [ProfileDescription, Divider, ContactForm, ProfileInfos],
    templateUrl: './profile-student.html'
})
export class ProfileStudent {
    mainservice = inject(MainService);
    router = inject(Router);
    destroyRef = inject(DestroyRef);
    activatedRoute = inject(ActivatedRoute);
    user = signal<UserDetails | null>(null);

    isOwner = false;

    ngOnInit() {
        const routeData = this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const studentId = params['id'];
            this.loadData(studentId);
            if (studentId === 'me') {
                this.isOwner = true;
            } else {
                this.isOwner = false;
            }
        });
    }

    async loadData(studentId: string) {
        if (studentId === 'me') {
            const studentData = await firstValueFrom(this.mainservice.getStudentFullProfile());
            if (studentData.data) {
                this.user.set(studentData.data);
            }
        }
    }
}

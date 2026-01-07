import { Component, DestroyRef, inject, signal } from '@angular/core';
import { UserDetails } from 'src/client';
import { ProfileDescription } from '../components/profile-description/profile-description';
import { Divider } from 'primeng/divider';
import { ContactForm } from '@/pages/components/contact-form/contact-form';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '@/pages/shared/services/main.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'bp-profile-student',
    imports: [ProfileDescription, Divider, ContactForm],
    templateUrl: './profile-student.html'
})
export class ProfileStudent {
    mainservice = inject(MainService);
    router = inject(Router);
    destroyRef = inject(DestroyRef);
    activatedRoute = inject(ActivatedRoute);
    student = signal<UserDetails | null>(null);

    isOwner = false;

    ngOnInit() {
        const routeData = this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const teacherId = params['id'];
            // this.loadData(teacherId);
            if (teacherId === 'me') {
                this.isOwner = true;
            } else {
                this.isOwner = false;
            }
        });
    }
}

import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Image } from 'primeng/image';
import { Tag } from 'primeng/tag';
import { UserDetails } from 'src/client';
import { MainService } from '@/pages/shared/services/main.service';

@Component({
    selector: 'bp-profile-infos',
    imports: [Image, Button, Card, Tag, RouterLink],
    templateUrl: './profile-infos.html'
})
export class ProfileInfos {
    mainService = inject(MainService);
    router = inject(Router);

    user = input.required<UserDetails>();
    showEditButton = input<boolean>(false);
    address = computed(() => {
        return this.user().addresses.length > 0 ? this.user().addresses[0] : null;
    });

    goToReservation() {
        if (this.mainService.userConnected() && this.mainService.userConnected().id && this.mainService.userConnected().id != this.user().id) {
            this.router.navigate(['/dashboard/student/planning'], { queryParams: { teacherId: this.user().id } });
        } else {
            this.router.navigate(['/auth/login']);
        }
    }
    goToEditProfile() {
        if (this.mainService.isTeacher()) {
            this.router.navigate(['/dashboard/teacher/profile', 'me', 'edition']);
        } else {
            if (this.mainService.isStudent()) {
                this.router.navigate(['/dashboard/student/profile', 'me', 'edition']);
            }
        }
    }
}

import { MainService } from '@/pages/shared/services/main.service';
import { PaymentWrapperService } from '@/pages/shared/services/payment-wrapper-service';
import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Image } from 'primeng/image';
import { Tag } from 'primeng/tag';
import { firstValueFrom } from 'rxjs';
import { RoleEnum, UserDetails } from 'src/client';

@Component({
    selector: 'bp-profile-infos',
    imports: [Image, Button, Card, Tag],
    templateUrl: './profile-infos.html'
})
export class ProfileInfos {
    mainService = inject(MainService);
    paymentWrapperService = inject(PaymentWrapperService);
    router = inject(Router);

    user = input.required<UserDetails>();
    isTeacher = computed(() => this.user()?.roles?.some((role: any) => role.name === RoleEnum.Teacher));
    isOwner = computed(() => this.mainService.userConnected()?.id === this.user()?.id);
    showEditButton = input<boolean>(false);
    address = computed(() => {
        return this.user().addresses.length > 0 ? this.user().addresses[0] : null;
    });

    goToReservation() {
        if (this.mainService.userConnected() && this.mainService.userConnected().id && this.mainService.userConnected().id != this.user().id) {
            this.router.navigate(['/dashboard/student/planning'], { queryParams: { teacherId: this.user().id } });
        } else {
            this.mainService.redirectUrlAfterLogin.set(['profile', this.user().id]);
            this.router.navigate(['/auth/login']);
        }
    }
    goToEditProfile() {
        if (this.mainService.isTeacher()) {
            this.router.navigate(['/dashboard/teacher/profile', 'me', 'edition'], { queryParams: { tab: 'personnalInfos' } });
        } else {
            if (this.mainService.isStudent()) {
                this.router.navigate(['/dashboard/student/profile', 'me', 'edition'], { queryParams: { tab: 'personnalInfos' } });
            }
        }
    }

    async connectToStripe() {
        const res = await firstValueFrom(this.paymentWrapperService.CreateConnectedAccountAsync({ email: this.user().email! }));
        console.log('response: ', res);
        if (res && res.onboardingUrl) {
            window.location.href = res.onboardingUrl!;
        }
    }
}

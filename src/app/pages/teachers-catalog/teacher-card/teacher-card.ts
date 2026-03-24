import { Component, computed, inject, input } from '@angular/core';
import { UserDetails } from 'src/client';
import { Card } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Tag } from 'primeng/tag';
import { Image } from 'primeng/image';
import { Button } from 'primeng/button';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MainService } from '@/pages/shared/services/main.service';

@Component({
    selector: 'bp-teacher-card',
    imports: [AutoCompleteModule, Tag, Image, Button],
    templateUrl: './teacher-card.html'
})
export class TeacherCard {
    sanitizer = inject(DomSanitizer);
    mainService = inject(MainService);
    router = inject(Router);

    teacher = input.required<UserDetails>();
    cursuses = computed(() => {
        return this.teacher().teacher?.cursuses?.splice(0, 3) || [];
    });
    descriptionSafeHtml = computed<SafeHtml>(() => {
        const description = this.teacher()?.description || 'Pas de description fournie';
        return this.sanitizer.bypassSecurityTrustHtml(description.replace(/\n/g, '<br>'));
    });

    goToProfile() {
        this.router.navigate(['/profile', this.teacher().id]);
    }
    goToReservation() {
        try {
            if (this.mainService.userConnected() && this.mainService.userConnected().id && this.mainService.userConnected().id != this.teacher().id) {
                this.router.navigate(['/dashboard/student/planning'], { queryParams: { teacherId: this.teacher().id } });
            } else {
                this.mainService.redirectUrlAfterLogin.set(['/profile', this.teacher().id]);
                this.router.navigate(['/auth/login']);
            }
        } catch (e) {
            console.error('Navigation error:', e);
        }
    }
}

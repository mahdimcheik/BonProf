import { FavoriteWrapperService } from '@/pages/shared/services/favorite-wrapper-service';
import { MainService } from '@/pages/shared/services/main.service';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Button } from 'primeng/button';
import { Image } from 'primeng/image';
import { Tag } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { UserDetails } from 'src/client';

@Component({
    selector: 'bp-teacher-card',
    imports: [AutoCompleteModule, Tag, Image, Button, TooltipModule],
    templateUrl: './teacher-card.html'
})
export class TeacherCard implements OnInit {
    sanitizer = inject(DomSanitizer);
    mainService = inject(MainService);
    favoriteService = inject(FavoriteWrapperService);
    router = inject(Router);

    teacher = input.required<UserDetails>();
    isFavorite = signal<boolean>(false);
    favoriteLoading = signal<boolean>(false);
    connected = computed(() => this.mainService.userConnected() != null && this.mainService.userConnected()?.email != null);

    cursuses = computed(() => {
        return this.teacher().teacher?.cursuses?.splice(0, 3) || [];
    });
    descriptionSafeHtml = computed<SafeHtml>(() => {
        const description = this.teacher()?.description || 'Pas de description fournie';
        return this.sanitizer.bypassSecurityTrustHtml(description.replace(/\n/g, '<br>'));
    });

    async ngOnInit() {
        if (this.connected()) {
            const favorite = await firstValueFrom(this.favoriteService.isFavorite(this.teacher().id));
            this.isFavorite.set(!!favorite);
        }
    }

    async toggleFavorite() {
        if (!this.connected() || this.favoriteLoading()) {
            return;
        }
        this.favoriteLoading.set(true);
        try {
            if (this.isFavorite()) {
                await firstValueFrom(this.favoriteService.removeFavorite(this.teacher().id));
                this.isFavorite.set(false);
            } else {
                await firstValueFrom(this.favoriteService.addFavorite({ teacherId: this.teacher().id }));
                this.isFavorite.set(true);
            }
        } finally {
            this.favoriteLoading.set(false);
        }
    }

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

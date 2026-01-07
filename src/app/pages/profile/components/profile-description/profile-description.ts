import { MainService } from '@/pages/shared/services/main.service';
import { Component, computed, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tooltip } from 'primeng/tooltip';

@Component({
    selector: 'bp-profile-description',
    imports: [Card, Button, Tooltip],
    templateUrl: './profile-description.html'
})
export class ProfileDescription {
    mainService = inject(MainService);
    teacher = this.mainService.userConnected;
    sanitizer = inject(DomSanitizer);
    descriptionSafeHtml = computed<SafeHtml>(() => {
        const description = this.teacher()?.teacher?.description || 'Pas de description fournie';
        return this.sanitizer.bypassSecurityTrustHtml(description.replace(/\n/g, '<br>'));
    });
    languages = computed(() => {
        return this.teacher()?.languages || [];
    });
}

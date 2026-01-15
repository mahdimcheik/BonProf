import { MainService } from '@/pages/shared/services/main.service';
import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tooltip } from 'primeng/tooltip';
import { UserDetails } from 'src/client';
import { SafeHtmlPipe } from '../../../shared/pipes/safe-html-pipe';

@Component({
    selector: 'bp-profile-description',
    imports: [Card, Button, Tooltip, SafeHtmlPipe],
    templateUrl: './profile-description.html'
})
export class ProfileDescription {
    mainService = inject(MainService);
    user = input.required<UserDetails>();
    sanitizer = inject(DomSanitizer);

    languages = computed(() => {
        return this.user()?.languages || [];
    });
}

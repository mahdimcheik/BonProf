import { TeacherWrapperService } from '@/pages/shared/services/teacher-wrapper-service';
import { Component, computed, inject, model } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { ProfileDetails } from 'src/client';

@Component({
    selector: 'bp-profile-description',
    imports: [Card, Button, Tag],
    templateUrl: './profile-description.html'
})
export class ProfileDescription {
    teacherWrapperService = inject(TeacherWrapperService);
    teacher = model.required<ProfileDetails>();
    sanitizer = inject(DomSanitizer);
    descriptionSafeHtml = computed<SafeHtml>(() => {
        const description = this.teacher()?.description || 'Pas de description fournie';
        return this.sanitizer.bypassSecurityTrustHtml(description.replace(/\n/g, '<br>'));
    });
    languages = computed(() => {
        return this.teacher()?.languages || [];
    });
}

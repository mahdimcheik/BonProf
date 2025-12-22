import { TeacherWrapperService } from '@/pages/shared/services/teacher-wrapper-service';
import { Component, computed, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';

@Component({
    selector: 'bp-profile-description',
    imports: [Card, Button, Tag],
    templateUrl: './profile-description.html'
})
export class ProfileDescription {
    teacherWrapperService = inject(TeacherWrapperService);
    user = this.teacherWrapperService.teacher;
    profile = computed(() => {
        return this.user()?.profile;
    });
    teacher = computed(() => {
        return this.user()?.teacher;
    });
    sanitizer = inject(DomSanitizer);
    descriptionSafeHtml = computed<SafeHtml>(() => {
        const description = this.teacher()?.description || 'Pas de description fournie';
        return this.sanitizer.bypassSecurityTrustHtml(description.replace(/\n/g, '<br>'));
    });
    languages = computed(() => {
        return this.profile()?.languages || [];
    });
}

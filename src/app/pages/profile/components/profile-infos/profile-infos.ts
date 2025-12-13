import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Image } from 'primeng/image';
import { Tag } from 'primeng/tag';
import { TeacherDetails } from 'src/client';

@Component({
    selector: 'bp-profile-infos',
    imports: [Image, Button, Card, Tag, RouterLink],
    templateUrl: './profile-infos.html'
})
export class ProfileInfos {
    teacher = input.required<TeacherDetails>();
    address = computed(() => {
        return this.teacher().user.addresses.length > 0 ? this.teacher().user.addresses[0] : null;
    });
}

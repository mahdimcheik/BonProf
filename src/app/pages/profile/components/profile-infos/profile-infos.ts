import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Image } from 'primeng/image';
import { Tag } from 'primeng/tag';
import { ProfileDetails } from 'src/client';

@Component({
    selector: 'bp-profile-infos',
    imports: [Image, Button, Card, Tag, RouterLink],
    templateUrl: './profile-infos.html'
})
export class ProfileInfos {
    teacher = input.required<ProfileDetails>();
    address = computed(() => {
        if (this.teacher() && this.teacher().addresses) {
            return this.teacher().addresses?.length! > 0 ? this.teacher().addresses![0] : null;
        }
        return null;
    });
}

import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Image } from 'primeng/image';
import { Tag } from 'primeng/tag';
import { TeacherDetails, UserDetails } from 'src/client';

@Component({
    selector: 'bp-profile-infos',
    imports: [Image, Button, Card, Tag, RouterLink],
    templateUrl: './profile-infos.html'
})
export class ProfileInfos {
    user = input.required<UserDetails>();
    showEditButton = input<boolean>(false);
    address = computed(() => {
        return this.user().addresses.length > 0 ? this.user().addresses[0] : null;
    });
}

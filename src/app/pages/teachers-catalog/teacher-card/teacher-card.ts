import { Component, computed, input } from '@angular/core';
import { UserDetails } from 'src/client';
import { Card } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Tag } from 'primeng/tag';
import { Image } from 'primeng/image';
import { Button } from 'primeng/button';

@Component({
    selector: 'bp-teacher-card',
    imports: [Card, AutoCompleteModule, Tag, Image, Button],
    templateUrl: './teacher-card.html'
})
export class TeacherCard {
    teacher = input.required<UserDetails>();
    cursuses = computed(() => {
        return this.teacher().teacher?.cursuses?.splice(0, 3) || [];
    });
}

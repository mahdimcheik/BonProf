import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';

@Component({
    selector: 'bp-profile-description',
    imports: [Card, Button, Tag],
    templateUrl: './profile-description.html'
})
export class ProfileDescription {}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Image } from 'primeng/image';
import { Tag } from 'primeng/tag';

@Component({
    selector: 'bp-profile-infos',
    imports: [Image, Button, Card, Tag, RouterLink],
    templateUrl: './profile-infos.html'
})
export class ProfileInfos {}

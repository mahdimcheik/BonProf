import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Image } from 'primeng/image';
import { Tag } from 'primeng/tag';

@Component({
    selector: 'bp-profile-infos',
    imports: [Image, Button, Card, Tag],
    templateUrl: './profile-infos.html'
})
export class ProfileInfos {}

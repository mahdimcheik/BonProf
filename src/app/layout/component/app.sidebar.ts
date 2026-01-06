import { Component, ElementRef, inject } from '@angular/core';
import { AppMenu } from './app.menu';
import { MainService } from '@/pages/shared/services/main.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu],
    template: ` <div class="layout-sidebar">
        <app-menu></app-menu>
    </div>`
})
export class AppSidebar {
    constructor(public el: ElementRef) {}
}

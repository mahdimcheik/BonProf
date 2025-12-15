import { Component, input, model } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';

@Component({
    selector: 'bp-base-modal',
    imports: [DialogModule, DrawerModule, ButtonModule, DividerModule],

    templateUrl: './base-modal.component.html',
    styleUrl: './base-modal.component.scss'
})
export class BaseModalComponent {
    visible = model(false);
    title = input<string>('Titre');
    iconClass = model<string>('pi pi-info-circle');

    onHide = () => {
        this.visible.set(false);
    };
}

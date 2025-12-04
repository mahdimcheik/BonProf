import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chip } from 'primeng/chip';
import { ColorPicker } from 'primeng/colorpicker';
import { TooltipModule } from 'primeng/tooltip';
import { ICellRendererAngularComp } from '.';

@Component({
    selector: 'app-color-grid',
    standalone: true,
    imports: [Chip, TooltipModule, ColorPicker, FormsModule],
    template: `
        <div class="flex gap-1">
            @if (data()) {
                @if (params().editMode) {
                    <div class="flex items-center gap-1">
                        <p-chip [label]="data().name ?? ''" [style]="{ 'background-color': data().color ?? 'red' }" [pTooltip]="data().description ?? ''"> </p-chip>
                        <p-colorPicker [(ngModel)]="data().color" (input)="onColorChange($event)"> </p-colorPicker>
                    </div>
                } @else {
                    <p-chip [label]="data().name ?? ''" [style]="{ 'background-color': data().color ?? 'red' }" [pTooltip]="data().description ?? ''"> </p-chip>
                }
            }
        </div>
    `
})
export class ColorGridComponent implements ICellRendererAngularComp {
    data = model<any>({});
    params = model<any>({
        editMode: false,
        callback: (data: any) => {}
    });

    onColorChange($event: any) {
        this.data().color = $event.value;
        this.params().callback(this.data());
    }
}

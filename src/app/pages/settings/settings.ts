import { Component } from '@angular/core';
import { AppConfigurator } from '@/layout/component/app.configurator';

@Component({
    selector: 'bp-settings',
    imports: [AppConfigurator],
    templateUrl: './settings.html'
})
export class Settings {}

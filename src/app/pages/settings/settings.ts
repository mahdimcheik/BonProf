import { Component } from '@angular/core';
import { AppConfigurator } from '@/layout/component/app.configurator';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';

@Component({
    selector: 'bp-settings',
    imports: [AppConfigurator, Tabs, TabList, Tab, TabPanels, TabPanel],
    templateUrl: './settings.html'
})
export class Settings {
    tab: string = 'visualAspect';
}

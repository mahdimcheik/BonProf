import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { FooterWidget } from './components/footerwidget';
import { TopbarWidget } from './components/topbarwidget.component';
import { AppConfigurator } from '@/layout/component/app.configurator';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [RouterModule, TopbarWidget, FooterWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule, AppConfigurator],
    template: `
        <div class=" min-h-[100dvh] bg-surface-0 dark:bg-surface-900 bg-surface-0 dark:bg-surface-900 ">
            <topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static h-[90px] " />
            <div class="min-h-[calc(100dvh-180px)]  max-w-[1536px] mx-auto ">
                <router-outlet></router-outlet>
            </div>
            <footer-widget />
            <div class="hidden">
                <app-configurator />
            </div>
        </div>
    `
})
export class Landing {}

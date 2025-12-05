import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { FooterWidget } from './components/footerwidget';
import { TopbarWidget } from './components/topbarwidget.component';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [RouterModule, TopbarWidget, FooterWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule],
    template: `
        <div class=" h-[100dvh] bg-surface-0 dark:bg-surface-900">
            <topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static h-[90px]" />
            <div class="min-h-[calc(100dvh-180px)] bg-surface-0 dark:bg-surface-900 ">
                <router-outlet></router-outlet>
            </div>
            <footer-widget />
        </div>
    `
})
export class Landing {}

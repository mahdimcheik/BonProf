import { Component } from '@angular/core';
import { FeaturesWidget } from '../../components/featureswidget';
import { HeroWidget } from '../../components/herowidget';
import { HighlightsWidget } from '../../components/highlightswidget';
import { PricingWidget } from '../../components/pricingwidget';

@Component({
    selector: 'bp-main-page',
    imports: [HeroWidget, FeaturesWidget, HighlightsWidget, PricingWidget],
    templateUrl: './main-page.html',
    styleUrl: './main-page.scss'
})
export class MainPage {}

import { AfterViewInit, ChangeDetectorRef, Component, computed, effect, inject, input, OnDestroy } from '@angular/core';
import { AddressDetails } from 'src/client';
import * as maplibregl from 'maplibre-gl';
import { LayoutService } from '@/layout/service/layout.service';

@Component({
    selector: 'bp-map-basic',
    imports: [],
    styleUrls: ['./map-basic.scss'],
    template: '@if(mainAddress().latitude && mainAddress().longitude){<div id="map" class=" rounded-xl min-h-[200px] w-full min-w-[300px]"></div>}'
})
export class MapBasic implements AfterViewInit, OnDestroy {
    layoutService = inject(LayoutService);
    cdr = inject(ChangeDetectorRef);
    mainAddress = input.required<AddressDetails>();
    secondaryAddress = input<AddressDetails | null>(null);

    latitude = computed(() => this.mainAddress().latitude ?? 48.8566);
    longitude = computed(() => this.mainAddress().longitude ?? 2.3522);
    zoom = 14;

    map!: maplibregl.Map;
    mapUrl = computed(() => {
        const isDark = this.layoutService.isDarkTheme();
        return isDark ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
    });

    constructor() {
        effect(() => {
            const url = this.mapUrl();
            if (this.map) {
                this.map.setStyle(url);
            }
        });
    }

    ngAfterViewInit(): void {
        this.map = new maplibregl.Map({
            container: 'map',
            style: this.mapUrl(),
            center: [this.longitude(), this.latitude()],
            zoom: this.zoom
        });

        new maplibregl.Marker().setLngLat([this.longitude(), this.latitude()]).addTo(this.map);
    }

    ngOnDestroy(): void {
        this.map?.remove();
    }
}

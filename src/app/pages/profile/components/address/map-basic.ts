import { AfterViewInit, Component, computed, input, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { AddressDetails, UserDetails } from 'src/client';

@Component({
    selector: 'bp-map-basic',
    imports: [],
    styleUrls: ['./map-basic.scss'],
    template: '@if(mainAddress().latitude && mainAddress().longitude){<div [id]="mapId" class=" rounded-xl min-h-[200px] w-full min-w-[300px]"></div>}'
})
export class MapBasic implements AfterViewInit, OnDestroy {
    user = input.required<UserDetails>();
    mainAddress = input.required<AddressDetails>();
    secondaryAddress = input<AddressDetails | null>(null);

    // Generate unique map ID for each instance
    mapId = `map-${Math.random().toString(36).substr(2, 9)}`;

    data = computed<AddressDetails[]>(() => {
        const mainAddress = this.mainAddress();
        const secondaryAddress = this.secondaryAddress();

        var addresses: AddressDetails[] = [];
        addresses.push(mainAddress);
        if (secondaryAddress) {
            addresses.push(secondaryAddress);
        }
        return addresses;
    });

    private map!: L.Map;
    private markersLayer!: L.MarkerClusterGroup;
    private mapInitialized = false;

    ngAfterViewInit(): void {
        this.markersLayer = L.markerClusterGroup();
        this.initMap();
        this.mapInitialized = true;
        this.loadMarkers();
        this.fitMapToMarkers();
    }

    constructor() {}

    private initMap(): void {
        this.map = L.map(this.mapId).setView([48.8566, 2.3522], 64);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(this.map);

        this.map.addLayer(this.markersLayer);
    }

    private buildMarkerTemplate(name: string): string {
        return `
    <div class="custom-marker">
      <div class="dot"></div>
      <img src="assets/bird.svg" alt="Marker image" width="30" height="30"/>
    </div>
  `;
    }

    private loadMarkers(): void {
        const data = this.data().map((addr) => ({
            lat: addr.latitude!,
            lng: addr.longitude!,
            name: addr.street || 'Adresse'
        }));

        this.markersLayer.clearLayers();

        data.forEach((p) => {
            const icon = L.divIcon({
                html: this.buildMarkerTemplate(p.name),
                className: '',
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            });
            const marker = L.marker([p.lat, p.lng], { icon });
            this.markersLayer.addLayer(marker);
        });
    }

    private fitMapToMarkers(): void {
        if (!this.map) return;
        const bounds = this.markersLayer.getBounds();
        if (bounds.isValid() && this.secondaryAddress()) {
            this.map.fitBounds(bounds, { padding: [50, 50] });
        } else {
            this.map.setView([this.mainAddress().latitude!, this.mainAddress().longitude!], 13);
        }
    }

    ngOnDestroy(): void {
        this.map?.remove();
    }
}

import { AfterViewInit, Component, computed, input, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { AddressDetails, UserDetails } from 'src/client';

@Component({
    selector: 'bp-map-basic',
    imports: [],
    styleUrls: ['./map-basic.scss'],
    template: '<div id="map" class="map-container rounded-xl"></div>'
})
export class MapBasic implements AfterViewInit, OnDestroy {
    teacher = input.required<UserDetails>();
    addressProfessor = input.required<AddressDetails>();
    addressStudent = input<AddressDetails | null>(null);
    data = computed<AddressDetails[]>(() => {
        const addressProf = this.addressProfessor();
        const addressStudent = this.addressStudent();

        var addresses: AddressDetails[] = [];
        addresses.push(addressProf);
        if (addressStudent) {
            addresses.push(addressStudent);
        }
        return addresses;
    });

    private map!: L.Map;
    private markersLayer = L.markerClusterGroup();
    private mapInitialized = false;

    ngAfterViewInit(): void {
        this.initMap();
        this.mapInitialized = true;
        this.loadMarkers();
        this.fitMapToMarkers();
    }

    constructor() {}

    private initMap(): void {
        this.map = L.map('map').setView([48.8566, 2.3522], 12);

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
        if (bounds.isValid()) {
            this.map.fitBounds(bounds, { padding: [50, 50] });
        }
    }

    ngOnDestroy(): void {
        this.map?.remove();
    }
}

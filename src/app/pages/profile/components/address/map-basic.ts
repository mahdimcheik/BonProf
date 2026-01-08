import { AfterViewInit, Component, computed, input, OnDestroy } from '@angular/core';
import { AddressDetails, UserDetails } from 'src/client';
import * as L from 'leaflet';

// 1. On importe le CSS du plugin (si ce n'est pas fait dans angular.json)
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// 2. L'astuce cruciale :
// Certains plugins (comme markercluster) dépendent de l'existence de "window.L".
// On attache manuellement notre instance importée à l'objet window.
// (Il faut parfois caster window en 'any' pour TypeScript)
(window as any).L = L;

// 3. On importe le JS du plugin APRÈS avoir défini window.L
import 'leaflet.markercluster';

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

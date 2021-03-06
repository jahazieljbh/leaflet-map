import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { icon, Marker } from 'leaflet';
import { MarkerService } from '../_services/marker.service';
import { ShapeService } from '../_services/shape.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

  private map;
  private states;

  constructor(private markerService: MarkerService,private shapeService: ShapeService) {
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.shapeService.getStateShapes().subscribe(states => {
    this.states = states;
    this.initStatesLayer();
    this.markerService.makeCapitalCircleMarkers(this.map);
});
  }

  private initStatesLayer() {
    const stateLayer = L.geoJSON(this.states, {
      style: (feature) => ({
        weight: 3,
        opacity: 0.5,
        color: '#008f39',
        fillOpacity: 0.8,
        fillColor: '#008f39'
      }),
      onEachFeature: (feature, layer) => (
  layer.on({
    mouseover: (e) => (this.highlightFeature(e)),
    mouseout: (e) => (this.resetFeature(e)),
  })
)
    });

    this.map.addLayer(stateLayer);
  }

  private highlightFeature(e)  {
    const layer = e.target;
    layer.setStyle({
      weight: 1,
      opacity: 1.0,
      color: '#6DB65B',
      fillOpacity: 1.0,
      fillColor: '#9AE86A',
    });
  }

  private resetFeature(e)  {
    const layer = e.target;
    layer.setStyle({
      weight: 1.3,
      opacity: 0.5,
      color: '#008f39',
      fillOpacity: 0.8,
      fillColor: '#008f39'
    });
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [30.5893576, -95.9129152],
      zoom: 4
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }
}
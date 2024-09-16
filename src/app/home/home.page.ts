import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import { Geolocation } from '@capacitor/geolocation';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';

import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor() { }
  latitude!: number;
  longitude!: number;

  public async ngOnInit() {
    
    // Mengambil posisi GPS
    const position = await Geolocation.getCurrentPosition();
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;

    // //Lokasi tetap sesuai koordinat
    // this.longitude = 110.36711541835224,
    //   this.latitude = -7.78219668228537

    const map = new Map({
      // basemap: "topo-vector"
      // basemap:"gray"
      basemap: "streets"
    });
    const view = new MapView({
      container: "container",
      map: map,
      zoom: 10,
      center: [this.longitude, this.latitude]
    });

    //Membuat objek marker lokasi
    const point = new Point({
      longitude: 110.3778691609815,
      latitude: -7.770034913764278,
    });

    // // Array berisi beberapa koordinat titik
    // const locations = [
    //   { longitude: 110.3778691609815, latitude: -7.770034913764278 },
    //   { longitude: 110.36711541835224, latitude: -7.78219668228537 },
    //   { longitude: 110.355072, latitude: -7.789034 }, // Tambah titik lainnya di sini
    // ];

    // // Iterasi untuk membuat dan menambahkan tiap marker
    // locations.forEach(location => {
    // // Membuat objek Point untuk setiap lokasi
    //   const point = new Point({
    //     longitude: location.longitude,
    //     latitude: location.latitude
    //   });

      // Membuat marker dengan gambar
      const markerSymbol = new PictureMarkerSymbol({
        type: "picture-marker",
        url: "assets/location2.png", // Gunakan gambar marker sesuai kebutuhan
        width: "35px",
        height: "35px"
      });

      // Membuat objek Graphic untuk tiap marker
      const pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol
      });

      // Menambahkan graphic ke peta
      view.graphics.add(pointGraphic);
  }
}


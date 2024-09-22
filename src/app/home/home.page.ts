import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import { Geolocation } from '@capacitor/geolocation';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';
import GroupLayer from '@arcgis/core/layers/GroupLayer';
import Basemap from '@arcgis/core/Basemap'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  mapView: MapView | any;
  userLocationGraphic: Graphic | any;
  selectedBasemap!: string;

  constructor() { }

  async ngOnInit() {
    const map = new Map({
      basemap: "streets"
    });

    this.mapView = new MapView({
      container: "container",
      map: map,
      zoom: 8
    });

    let weatherServiceFL = new ImageryLayer({ url: WeatherServiceUrl });
    map.add(weatherServiceFL);

    this.addWeatherServiceMarker();

    await this.updateUserLocationOnMap();
    this.mapView.center = this.userLocationGraphic.geometry as Point; //Map center sesuai geolocation
    setInterval(this.updateUserLocationOnMap.bind(this), 100000);
  }

  //Mengubah Basemap
  async changeBasemap() {
    this.mapView.map.basemap = this.selectedBasemap;
  }

  //Current Location Pengguna
  async getLocationService(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve([resp.coords.latitude, resp.coords.longitude]);
      });
    });
  }

  //Update Current Location Pengguna
  async updateUserLocationOnMap() {
    let latLng = await this.getLocationService();
    let geom = new Point({ latitude: latLng[0], longitude: latLng[1] });
    if (this.userLocationGraphic) {
      this.userLocationGraphic.geometry = geom;
    } else {
      this.userLocationGraphic = new Graphic({
        symbol: new SimpleMarkerSymbol(),
        geometry: geom,
      });
      this.mapView.graphics.add(this.userLocationGraphic);
    }
  }

  //Marker di Lokasi Weather Service
  addWeatherServiceMarker() {
    const locations = [
      { latitude: 38.859216863568335, longitude: -92.9682588257259 },
      { latitude: 40.26731343533949, longitude: -94.11128898454433 },
      { latitude: 44.42829525541613, longitude: -88.95474304557064 },
      { latitude: 41.569457859013134, longitude: -93.5846014925945 }
    ];

    // Iterasi melalui setiap lokasi
    locations.forEach(location => {
      const weatherServiceLocation = new Point({
        latitude: location.latitude,
        longitude: location.longitude,
      });

      //Mengatur tampilan simbol
      const markerSymbol = new PictureMarkerSymbol({
        type: "picture-marker",
        url: "assets/location2.png", // Gambar marker
        width: "35px",
        height: "35px"
      });
      const pointGraphic = new Graphic({
        geometry: weatherServiceLocation,
        symbol: markerSymbol
      });

      // Tambahkan marker ke peta
      this.mapView.graphics.add(pointGraphic);
    });
  }

}
const WeatherServiceUrl =
  'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer'


// //Membuat objek marker lokasi
// const point = new Point({
//   // longitude: 110.3778691609815,
//   // latitude: -7.770034913764278,
//   longitude: this.longitude,
//   latitude: this.latitude,
// });

// // Array berisi beberapa koordinat titik
// const locations = [
//   { longitude: 40.3395834702893, latitude: -94.11128898454433},
//   { longitude: 49.910567191006045, latitude: -95.3772383660649 },
//   { longitude: 49.81014697521505, latitude: -94.46364800451474 }, // Tambah titik lainnya di sini
// ];

// // Iterasi untuk membuat dan menambahkan tiap marker
// locations.forEach(location => {
// // Membuat objek Point untuk setiap lokasi
//   const point = new Point({
//     longitude: location.longitude,
//     latitude: location.latitude
//   });

// // Membuat marker dengan gambar
// const markerSymbol = new PictureMarkerSymbol({
//   type: "picture-marker",
//   url: "assets/location2.png", // Gunakan gambar marker sesuai kebutuhan
//   width: "35px",
//   height: "35px"
// });

// // Membuat objek Graphic untuk tiap marker
// const pointGraphic = new Graphic({
//   geometry: point,
//   symbol: markerSymbol
// });

// // Menambahkan graphic ke peta
// view.graphics.add(pointGraphic);

import { Component, OnInit } from '@angular/core';
import { MapItemService, MapItem } from '../providers/map-service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  mapItems: MapItem[];
  useStore: boolean[] = new Array(10);

  constructor(public mapItemService: MapItemService) { 
    this
    .mapItemService
    .mapItemsData
    .subscribe((mapItems: MapItem[]) => {
      this.mapItems = mapItems;
    });

    this.mapItemService.getAllMapItems();

    console.log("map page: we have ", this.mapItems.length, " map items");

  }

  ngOnInit() {
    console.log("use store 0 = ", this.useStore[0])
    for (let ii=0; ii < this.mapItems.length; ii++) {
      this.useStore[ii] = true;
    }
  }

  toggleStore(i: number) {
    this.useStore[i] = !this.useStore[i];
  }
  getUseStore(i: number) {
    return this.useStore[i];
  }

  lessThanRating(i: number, rating: number) {
    return (i < rating);
  }

}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface MapItem {
  'id': string;
  'name': string;
  'description': string;
  'type': string;
  'street': string;
  'city': string;
  'state': string;
  'zip': string;
  'phone': string;
  'hrsweekday': string;
  'hrsweekend': string;
  'rating': number;
  'numRatings': any;
  'website': string;
}

@Injectable()
export class MapItemService {
  public mapItems: MapItem[] = [];
  public mapItemsData: BehaviorSubject<MapItem[]> = new BehaviorSubject<MapItem[]>([]);

  p: MapItem;

  constructor() {
  }

  getMapItem(id): MapItem {
    return this.mapItems.find(mapItem => mapItem.id === id);
  }

  removeMapItem(id) {
    this.p = this.mapItems.find(mapItem => mapItem.id === id);
    var index = this.mapItems.findIndex(mapItem => mapItem.id === id);
    console.log("mapItemService: remove mapItem with index = ", index);
    this.mapItems.splice(index, 1);
}

  getAllMapItems() {
    this.mapItems = [
      {
        id: '1000',
        name: 'MMD Inc.',
        description: '',
        type: 'Cannabis Store',
        street: '1515 N Cahuenga Blvd.',
        city: '',
        state: '',
        zip: '',
        phone: '(877) 420-5874',
        hrsweekday: '8AM-7PM Mon-Fri',
        hrsweekend: '8AM-5PM Sat, Closed Sun',
        rating: '3.9',
        numRatings: '62',
        website: 'www.mmdshops.com'
      },
      {
        id: '1001',
        name: 'William S. Eidelman, MD',
        description: '',
        type: 'Naturopathic Medicine',
        street: '1654 N Cahuenga Blvd',
        city: 'Hollywood',
        state: 'CA',
        zip: '',
        phone: '(323) 463-3295',
        hrsweekday: '9AM-4PM Mon-Thu',
        hrsweekend: 'Closed Sat-Sun',
        rating: '4.4',
        numRatings: '13',
        website: 'www.dreidelman.com'
      },
      {
        id: '1002',
        name: 'The Doctors - Hollywood - Medical Marijuana',
        description: '',
        type: 'Alternative Medicine',
        street: '1439 N Highland Ave',
        city: '',
        state: '',
        zip: '',
        phone: '(323) 463-5000',
        hrsweekday: '9AM-6PM Mon-Fri',
        hrsweekend: '9AM-5PM Sat-Sun',
        rating: '3.7',
        numRatings: '22',
        website: 'www.la420doctor.com'
      },
      {
        id: '1003',
        name: 'Hollywood Health Clinic',
        description: '',
        type: 'Medical Clinic',
        street: '6464 Sunset Blvd #947',
        city: '',
        state: '',
        zip: '',
        phone: '(323) 466-7688',
        hrsweekday: '',
        hrsweekend: '',
        rating: '4.0',
        numRatings: '1',
        website: ''
      },
      {
        id: '1004',
        name: 'Otherside Health Management',
        description: '',
        type: 'Greenhouse',
        street: '6115 Selma Ave',
        city: '',
        state: '',
        zip: '',
        phone: '(323) 871-2488',
        hrsweekday: '10AM-5PM Mon-Fri',
        hrsweekend: 'Closed Sat-Sun',
        rating: '3.0',
        numRatings: '2',
        website: ''
      }
    ];
    this.mapItemsData.next(this.mapItems);
  }

}

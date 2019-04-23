import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Item {
  'id': string;
  'name': string;
  'description': string;
  'CBD': string;
  'THC': string;
  "rating": string;
  "price": string;
  "type": string;
  "mnf": string;
  "img1": string;
}

@Injectable()
export class ItemService {
  public items: Item[] = [];
  public itemsData: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);

  constructor() {
  }

  getAllItems() {
    this.items = [
      {
        id: '1000',
        name: 'Indica Kush',
        description: 'Good Buds',
        CBD: '1.2',
        THC: '10.1',
        rating: '5',
        price: '$10 per gram',
        type: 'FL',
        mnf: 'Farmer Green',
        img1: 'FL_buds-02.jpg'
      },
      {
        id: '1001',
        name: 'Diesel Kush',
        description: 'Good Buds.  Homegrown.  Very Stinky and Sticky',
        CBD: '1.4',
        THC: '8.1',
        rating: '4.5',
        price: '$8 per gram',
        type: 'FL',
        mnf: 'Farmer Brown, LLC',
        img1: 'FL_buds-03.jpg'
      },
      {
        id: '1002',
        name: 'Happy Bears',
        description: 'Medicinal Gummy Bears',
        CBD: '10.2',
        THC: '1.1',
        rating: '4',
        price: '$22 per 25 pcs.',
        type: 'ED',
        mnf: 'Medicinal Treats, Inc.',
        img1: 'ED_gummyBears-01.jpg'
      },
      {
        id: '1003',
        name: 'Coconut CBD Oil',
        description: 'CBD Infused Coconut Oil',
        CBD: '10.2',
        THC: '1.1',
        rating: '4',
        price: '$22 per 25 oz.',
        type: 'EX',
        mnf: 'Century Oil, Inc.',
        img1: 'ED_cbdCoconutOil-01.jpg'
      },
      {
        id: '1004',
        name: 'Mars Bears',
        description: 'THC Gummy Bears',
        CBD: '2.2',
        THC: '11.1',
        rating: '5',
        price: '$28 per 25 pcs.',
        type: 'ED',
        mnf: 'Medicinal Treats, Inc.',
        img1: 'ED_gummyBears-01.jpg'
      },
      {
        id: '1005',
        name: 'Milk Chocolate Bar',
        description: 'Chocolate Cannabis Bar',
        CBD: '0.2',
        THC: '7.1',
        rating: '3.5',
        price: '$22 per 6 oz.',
        type: 'ED',
        mnf: 'Chocolate Infusion, Inc.',
        img1: 'ED_milkChocolate-01.jpg'
      },
      {
        id: '1006',
        name: 'White Chocolate',
        description: 'White Chocolate Bar Infused with Medicinal CBD',
        CBD: '10.2',
        THC: '2.1',
        rating: '4.5',
        price: '$25 per 6 oz.',
        type: 'ED',
        mnf: 'Chocolate Infusion, Inc.',
        img1: 'ED_whiteChocolate-01.jpg'
      }
    ];
    this.itemsData.next(this.items);
  }

  getItem(id): Item {
    return this.items.find(item => item.id === id);
  }
}

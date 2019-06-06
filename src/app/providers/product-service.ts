import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Product {
  'id': string;
  'description': string;
  'name': string;
  'CBD': string;
  'THC': string;
  'rating': string;
  'price': any;
  'priceString': string;
  'qty': any;
  'type': string;
  'mnf': string;
  'img1': string;
}

@Injectable()
export class ProductService {
  public products: Product[] = [];
  public productsData: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

  p: Product;

  constructor() {
  }

  getProduct(id): Product {
    return this.products.find(product => product.id === id);
  }

  removeProduct(id) {
    this.p = this.products.find(product => product.id === id);
    var index = this.products.findIndex(product => product.id === id);
    console.log("productService: remove product with indes = ", index);
    this.products.splice(index, 1);
}

  getAllProducts() {
    this.products = [
      {
        id: '1000',
        description: 'Good Buds',
        name: 'Indica Kush',
        CBD: '1.2',
        THC: '10.1',
        rating: '5',
        price: '10.00',
        priceString: '$10 per gram',
        qty: '0',
        type: 'FL',
        mnf: 'Farmer Green',
        img1: 'FL_buds-01.jpg'
      },
      {
        id: '1001',
        description: 'Good Buds.  Homegrown.  Very Stinky and Sticky',
        name: 'Diesel Kush',
        CBD: '1.4',
        THC: '8.1',
        rating: '4.5',
        price: '8.00',
        priceString: '$8 per gram',
        qty: '0',
        type: 'FL',
        mnf: 'Farmer Brown, LLC',
        img1: 'FL_buds-03.jpg'
      },
      {
        id: '1002',
        description: 'Medicinal Gummy Bears',
        name: 'Happy Bears',
        CBD: '10.2',
        THC: '1.1',
        rating: '4',
        price: '22.00',
        priceString: '$22 per 25 pcs.',
        qty: '0',
        type: 'ED',
        mnf: 'Medicinal Treats, Inc.',
        img1: 'ED_gummyBears-01.jpg'
      },
      {
        id: '1003',
        name: 'CBD Coconut Oil',
        description: 'CBD Infused Coconut Oil',
        CBD: '10.2',
        THC: '1.1',
        rating: '4',
        price: '22.50',
        priceString: '$22.50 per 25 oz.',
        qty: '0',
        type: 'EX',
        mnf: 'Century Oil, Inc.',
        img1: 'EX_CoconutOil-01.jpg'
      },
      {
        id: '1004',
        name: 'Mars Bears',
        description: 'THC Gummy Bears',
        CBD: '2.2',
        THC: '11.1',
        rating: '5',
        price: '$28.00',
        priceString: '$28 per 25 pcs.',
        qty: '0',
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
        price: '22.50',
        priceString: '$22.50 per 6 oz.',
        qty: '0',
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
        price: '25.00',
        priceString: '$25 per 6 oz.',
        qty: '0',
        type: 'ED',
        mnf: 'Chocolate Infusion, Inc.',
        img1: 'ED_whiteChocolate-01.jpg'
      },
      {
        id: '1007',
        name: 'Water Pipe',
        description: 'Colorful Water Pipe',
        CBD: 'NA',
        THC: 'NA',
        rating: '4.5',
        price: '29.50',
        priceString: '$29.50',
        qty: '0',
        type: 'AC',
        mnf: 'Pipes R Us, LLC.',
        img1: 'AC_waterPipe-01.jpg'
      },
      {
        id: '1008',
        name: 'Dog Biscuit',
        description: 'Dog Biscuit Infused with Medicinal CBD',
        CBD: '10.6',
        THC: '0.5',
        rating: '4.2',
        price: '2.50',
        priceString: '$2.50 per 6 oz.',
        qty: '0',
        type: 'PA',
        mnf: 'Edible Treats, Inc.',
        img1: 'PA_dogTreat-01.jpg'
      }
    ];
    this.productsData.next(this.products);
  }

}

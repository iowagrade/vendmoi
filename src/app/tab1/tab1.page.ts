import { Component } from '@angular/core';

import { ProductService, Product } from '../providers/product-service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {

  products: Product[];
  
  flowersToggle: boolean;
  ediblesToggle: boolean;
  extractsToggle: boolean;

  constructor(/*private platform: Platform,*/ public productService: ProductService) {

    this.extractsToggle = true;
    this.flowersToggle = true;
    this.ediblesToggle = true;

    // if (Capacitor.platform === 'web') {
      // this.testPluginWeb();
      // this.testYoutubePlayerPlugin();
    // } else {
      // this.testPluginNative();
    // }
    this
      .productService
      .productsData
      .subscribe((products: Product[]) => {
        this.products = products;
      });

    this.productService.getAllProducts();
  };

  toggleFlowers() {
    this.flowersToggle = !this.flowersToggle;
  }
  getFlowersToggle() {
    return this.flowersToggle;
  }

  toggleEdibles() {
    this.ediblesToggle = !this.ediblesToggle;
  }
  getEdiblesToggle() {
    return this.ediblesToggle;
  }

  toggleExtracts() {
    this.extractsToggle = !this.extractsToggle;
  }
  getExtractsToggle() {
    return this.extractsToggle;
  }

}

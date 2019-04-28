import { Component, OnInit } from '@angular/core';

import { ProductService, Product } from '../providers/product-service';
import { CartItemService, CartItem } from '../providers/cart-service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {

  products: Product[];
  ci: CartItem;
  qtyItems: number;
  
  arToggle: boolean = false;
  flowersToggle: boolean = true;
  ediblesToggle: boolean = true;
  extractsToggle: boolean = true;

  constructor(/*private platform: Platform,*/public cartItemService: CartItemService,  public productService: ProductService) {

  //  this.extractsToggle = true;
  //  this.flowersToggle = true;
  //  this.ediblesToggle = true;

    // if (Capacitor.platform === 'web') {
      // this.testPluginWeb();
      // this.testYoutubePlayerPlugin();
    // } else {
      // this.testPluginNative();
    // }
    this
    .cartItemService
    .cartItemsData
    //.subscribe((cartItems: CartItem[]) => {
    //  this.cartItems = cartItems;
    //});
    //this.cartItemService.getAllCartItems();

    this
      .productService
      .productsData
      .subscribe((products: Product[]) => {
        this.products = products;
      });

    this.productService.getAllProducts();
  };

  ngOnInit() {
      this.qtyItems = this.cartItemService.getQtyCartItems();
  }

  toggleAR() {
    this.arToggle = !this.arToggle;
  }
 
  toggleFlowers() {
    this.flowersToggle = !this.flowersToggle;
  }
 
  toggleEdibles() {
    this.ediblesToggle = !this.ediblesToggle;
  }
 
  toggleExtracts() {
    this.extractsToggle = !this.extractsToggle;
  }

}

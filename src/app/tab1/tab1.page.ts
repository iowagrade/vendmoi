import { Component, OnInit } from '@angular/core';

// this is to address back button issue
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
// this is end of address back button issue

import { GlobalService } from '../providers/global-service';
import { ProductService, Product } from '../providers/product-service';
import { CartItemService, CartItem } from '../providers/cart-service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {

  userName: string = "";
  loggedIn: boolean = false;

  products: Product[];
  ci: CartItem;
  qtyItems: number;
  
  arToggle: boolean = false;
  flowersToggle: boolean = true;
  ediblesToggle: boolean = true;
  extractsToggle: boolean = true;
  accessoriesToggle: boolean = true;
  petCareToggle: boolean = true;

  constructor(/*private platform: Platform,*/public globalService: GlobalService,
    public cartItemService: CartItemService,  
    public productService: ProductService,
    private readonly _router: Router) {

  _router.events.pipe(
    filter(event => event instanceof NavigationStart)
  ).subscribe((route: NavigationStart) => {
    console.log("we are here in the filter")
    this.qtyItems = this.cartItemService.getQtyCartItems();
    console.log("tab1 onInit qtyItems = ", this.qtyItems);
  });

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
    console.log("tab1 onInit qtyItems = ", this.qtyItems);
  }

  getUserName() {
    console.log("In Tab1 - getUserName")
    this.userName = this.globalService.getUserName();
    if(this.userName.length > 0)
      this.loggedIn = true;
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

  toggleAccessories() {
    this.accessoriesToggle = !this.accessoriesToggle;
  }

  togglePetCare() {
    this.petCareToggle = !this.petCareToggle;
  }

  ionViewWillEnter() {
    this.qtyItems = this.cartItemService.getQtyCartItems();
    console.log("tab1 onViewWillEnter qtyItems = ", this.qtyItems);

    this.getUserName();
  }

  ionViewDidEnter() {
    console.log("tab1 onViewDidEnter qtyItems = ", this.qtyItems);
  }

}

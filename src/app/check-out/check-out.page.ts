import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../providers/product-service';
import { CartItemService, CartItem } from '../providers/cart-service';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.page.html',
  styleUrls: ['./check-out.page.scss'],
})

export class CheckOutPage implements OnInit {

  shipMethod: string = "2ndDay";
  payMethod: string = "card";
  payCard: boolean = true;

  isDisabled: boolean = true;
  qtyItems: number = 0;
  shipCost: number = 0.0;
  groundShipCost: number = 0.0;
  secondShipCost: number = 0.0;
  todayShipCost: number = 0.0;

  cartItems: CartItem[];
  products: Product[];
  cartProducts: Product[] = []; // local # for calculation
  totalCost: number = 0.0;
  grandTotalCost: number = 0.0;
  itemTotal: number[] = [];
  qtyInCart: number = 0;

  constructor(public cartItemService: CartItemService, public productService: ProductService) { 

    this
    .cartItemService
    .cartItemsData
    .subscribe((cartItems: CartItem[]) => {
      this.cartItems = cartItems;
    });
    this.cartItemService.getAllCartItems();

    this
    .productService
    .productsData
    .subscribe((products: Product[]) => {
      this.products = products;
    });
    this.productService.getAllProducts();

  }

  ngOnInit() {
    for(var i = 0; i < this.cartItems.length; i++) {
      this.cartProducts.push(this.productService.getProduct(this.cartItems[i].id));
    }
    this.calcCartTotals();
    this.calcShipCost();

    //this.qtyItems = this.cartItemService.getQtyCartItems();
    this.qtyInCart = this.cartItemService.getQtyCartItems();
    console.log("shopping cart onInit qtyItems = ", this.qtyItems);
  }
   
  calcCartTotals() {
    // load cartProducts
    this.totalCost = 0;
    console.log("shopping cart # of cart items = ", this.cartItems.length);
    console.log("onInit totalCost = ", this.totalCost);
    for(var i = 0; i < this.cartItems.length; i++) {
      console.log("shopping cart counter i", i);
      //this.cartProducts[i].qtyPrice = this.cartProducts[i].price * this.cartItems[i].quantity;
      console.log("item ID, price * qty = ", this.cartItems[i].id, this.cartProducts[i].price, this.cartItems[i].quantity, this.cartProducts[i].price * this.cartItems[i].quantity)
      this.itemTotal[i] = this.cartProducts[i].price * this.cartItems[i].quantity;
      this.totalCost += this.cartProducts[i].price * this.cartItems[i].quantity;
    }
    console.log("shopping cart # of cart products = ", this.cartProducts.length);
    console.log("in cart OnInit, totalCost = ", this.totalCost);
  
    this.qtyItems = this.cartItemService.getQtyCartItems();
  }

  calcShipCost() {
    this.groundShipCost = this.totalCost * 0.05;
    this.secondShipCost = this.totalCost * 0.12;
    this.todayShipCost = this.totalCost * 0.18;

    if(this.shipMethod == "ground") {
      this.shipCost = this.groundShipCost;
    }
    else if(this.shipMethod == "2ndDay") {
      this.shipCost = this.secondShipCost;
    }
    else {
      this.shipCost = this.todayShipCost;
    }
    this.grandTotalCost = this.totalCost + this.shipCost;
  }
  
  updatePayMethod() {
    if(this.payMethod=="card") {
      this.payCard = true;
    }
    else {
      this.payCard = false;
    }
  }
}

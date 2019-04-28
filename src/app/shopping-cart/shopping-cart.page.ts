import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../providers/product-service';
import { CartItemService, CartItem } from '../providers/cart-service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.page.html',
  styleUrls: ['./shopping-cart.page.scss'],
})
export class ShoppingCartPage implements OnInit {

  cartItems: CartItem[];
  products: Product[];
  cartProducts: Product[] = []; // local # for calculation
  totalCost: any = 0.0;
  itemTotal: number[] = [];

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
    
    // load cartProducts
    console.log("shopping cart # of cart items = ", this.cartItems.length);
    console.log("onInit totalCost = ", this.totalCost);
    for(var i = 0; i < this.cartItems.length; i++) {
      this.cartProducts.push(this.productService.getProduct(this.cartItems[i].id));
      //this.cartProducts[i].qtyPrice = this.cartProducts[i].price * this.cartItems[i].quantity;
      console.log("price * qty = ", this.cartProducts[i].price, this.cartItems[i].quantity, this.cartProducts[i].price * this.cartItems[i].quantity)
      this.itemTotal[i] = this.cartProducts[i].price * this.cartItems[i].quantity;
      this.totalCost += this.cartProducts[i].price * this.cartItems[i].quantity;
    }
    console.log("shopping cart # of cart products = ", this.cartProducts.length);
    console.log("in cart OnInit, totalCost = ", this.totalCost);
  }

  getSolution(a:number, b:number) {
    return a * b;
  }

}

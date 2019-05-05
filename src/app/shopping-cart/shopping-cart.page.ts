import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../providers/product-service';
import { CartItemService, CartItem } from '../providers/cart-service';
import { GlobalService } from '../providers/global-service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.page.html',
  styleUrls: ['./shopping-cart.page.scss'],
})
export class ShoppingCartPage implements OnInit {

  ageVerified: boolean = false;
  cp: Product;
  ci: CartItem;
  cartItems: CartItem[];
  products: Product[];
  cartProducts: Product[] = []; // local # for calculation
  totalCost: any = 0.0;
  itemTotal: number[] = [];
  qtyItems: number = 0;
  qtyInCart: number = 0;

  constructor(public globalService: GlobalService, 
              public cartItemService: CartItemService, 
              public productService: ProductService) { 

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
    this.ageVerified = this.globalService.getAgeVerified();
    console.log("enter shopping cart page, age verified = ", this.ageVerified);

    for(var i = 0; i < this.cartItems.length; i++) {
      this.cartProducts.push(this.productService.getProduct(this.cartItems[i].id));
    }
    this.calcCartTotals();

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

  addToCart(product: Product) {
    console.log("shoppingcart.ts - addToCart ", this.qtyInCart);
    this.qtyInCart ++;
    this.cartItemService.addNewCartItem(product.id, 1);
    this.qtyItems ++;

    this.calcCartTotals();
  }

  removeFromCart(product: Product) {
    console.log("removeFromCart detail", this.qtyInCart);
    if(this.qtyInCart > 0) {
      this.qtyInCart --;
      this.cartItemService.removeCartItem(product.id);
      this.qtyItems --;

      //if number of this cartItem in cart = 0, then remove from cartProducts list
      this.ci = this.cartItemService.getCartItem(product.id);
      if(this.ci) {
        console.log("this item is still in list of products")
      }
      else {
       // console.log("shopping cart: remove product id = ", product.id);
       // this.productService.removeProduct(product.id);

        // need to remove from local list of cartProducts
        //this.cp = this.cartProducts.find(product => product.id === product.id);
        var theId = product.id;
        var index = this.cartProducts.findIndex(product => product.id === theId);
        console.log("shoppingCart: remove cartProduct with index = ", index);
        this.cartProducts.splice(index, 1);    
      }
    }

    this.calcCartTotals();
  }

}

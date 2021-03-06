import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { injectTemplateRef } from '@angular/core/src/render3/view_engine_compatibility';

export interface CartItem {
  'id': string;
  'quantity': number;
}

@Injectable()
export class CartItemService {
  
  public cartItems: CartItem[] = [];
  public cartItemsData: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);
  public newItem: CartItem = {'id': '999', 'quantity':1};
  public ci: CartItem;
  totalNum: number = 0;

  constructor() {
  /*  this.cartItems = [
      {
        id: '1000',
        quantity: 1
      },
      {
        id: '1001',
        quantity: 1
      },
      {
        id: '1002',
        quantity: 3
      }
    ]; */
   }

   getQtyCartItems() {
     this.totalNum = 0;
     for(var i = 0; i < this.cartItems.length; i ++) {
      this.totalNum += this.cartItems[i].quantity;
     }
     return this.totalNum;
   }

   addNewCartItem(id:string, qty) {
    this.ci = this.getCartItem(id);
    if(this.ci) {
      console.log("this item was already in cart");
      console.log("had # items in cart adding qty", this.ci.quantity, qty)
      this.ci.quantity += qty;
    }
    else {
      var ni = <CartItem>{};
      ni.id = id;
      ni.quantity = qty;
      console.log("addNewCartItem id = ", id);
      this.newItem.id = id;
      //console.log("step1");
      this.newItem.quantity = qty;
      console.log("cart service # items = ", this.cartItems.length);
      this.cartItems.push(ni);
      //this.cartItems.push(this.newItem);
      console.log("after add, cart service # items = ", this.cartItems.length);
    }
  }

  removeCartItem(id:string) {
    this.ci = this.getCartItem(id);
    if(this.ci) {
      console.log("had # items in cart removing 1 item");
      this.ci.quantity -= 1;

      if(this.ci.quantity == 0) { //need to remove from the array of cartItems
        console.log("now quantity = 0, so need to remove item from list");
        var index = this.cartItems.findIndex(cartItem => cartItem.id == id);
        this.cartItems.splice(index, 1);
      }
    }
  }

  addCartItem(cartItem) {
    this.cartItems.push(cartItem);
  }

  getCartItem(id): CartItem {
    return this.cartItems.find(cartItem => cartItem.id === id);
  }

  getAllCartItems() {
    //return this.cartItems;
    this.cartItemsData.next(this.cartItems);
  }
}

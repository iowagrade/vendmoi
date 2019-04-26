import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { injectTemplateRef } from '@angular/core/src/render3/view_engine_compatibility';

export interface CartItem {
  'id': string;
  'quantity': any;
}

@Injectable()
export class CartItemService {
  
  public cartItems: CartItem[] = [];
  public cartItemsData: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);
  public newItem: CartItem = {'id': '999', 'quantity':'1'};

  constructor() {
    this.cartItems = [
      {
        id: '1000',
        quantity: '2'
      },
      {
        id: '1005',
        quantity: '1'
      },
      {
        id: '1006',
        quantity: '3'
      }
    ];
   }

  addNewCartItem(id:string, qty) {
    console.log("addNewCartItem id = ", id);
    this.newItem.id = id;
    //console.log("step1");
    this.newItem.quantity = qty;
    console.log("cart service # items = ", this.cartItems.length);
    this.cartItems.push(this.newItem);
    console.log("after add, cart service # items = ", this.cartItems.length);
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

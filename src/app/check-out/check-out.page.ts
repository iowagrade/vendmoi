import { Component, OnInit } from '@angular/core';
import { CartItemService, CartItem } from '../providers/cart-service';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.page.html',
  styleUrls: ['./check-out.page.scss'],
})
export class CheckOutPage implements OnInit {

  shipMethod: any;
  isDisabled: boolean = true;
  payMethod: any;
  qtyItems: number = 0;

  constructor(public cartItemService: CartItemService) { }

  ngOnInit() {
    this.qtyItems = this.cartItemService.getQtyCartItems();
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../providers/product-service';
import { CartItemService, CartItem } from '../providers/cart-service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

  product: Product;
  qtyInCart: any = 0;
  newId: string = '1002';

//  constructor() { }
  constructor(private route: ActivatedRoute, public cartItemService: CartItemService, public productService: ProductService) {
  }

  ngOnInit() {
  }

  addToCart() {
    console.log("addToCart");
    this.qtyInCart ++;
    this.cartItemService.addNewCartItem(this.product.id, this.qtyInCart);
  }

  ionViewWillEnter() {
    // console.log('ionViewWillEnter');
    // console.log('this.route.snapshot', this.route.snapshot);
    const productId = this.route.snapshot.paramMap.get('id');
    console.log('productId', productId);
    this.product = this.productService.getProduct(productId);
  }
}

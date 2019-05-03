import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../providers/product-service';
import { CartItemService, CartItem } from '../providers/cart-service';

// to address back button bug
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

  product: Product;
  qtyInCart: any = 0;
  newId: string = '1002';
  ci: CartItem;
  qtyItems: number = 0;
  itemsPrice: number = 0;

//  constructor() { }
  constructor(private route: ActivatedRoute, public cartItemService: CartItemService, 
          public productService: ProductService, public navCtrl: NavController) {
  }

  gotoPreviousPage() {
    console.log("productDetail go back");
    this.navCtrl.navigateRoot("");
  }

  ngOnInit() {
    this.qtyItems = this.cartItemService.getQtyCartItems();
    console.log("productDetail onInit qtyItems = ", this.qtyItems);
  }

  calcPrice() {
    this.itemsPrice = this.qtyInCart * this.product.price;
  }

  addToCart() {
    console.log("addToCart detail", this.qtyInCart);
    this.qtyInCart ++;
    this.cartItemService.addNewCartItem(this.product.id, 1);
    this.qtyItems ++;
    this.calcPrice();
  }

  removeFromCart() {
    console.log("removeFromCart detail", this.qtyInCart);
    if(this.qtyInCart > 0) {
      this.qtyInCart --;
      this.cartItemService.removeCartItem(this.product.id);
      this.qtyItems --;
    }
    this.calcPrice();
  }

  ionViewWillEnter() {
    // console.log('ionViewWillEnter');
    // console.log('this.route.snapshot', this.route.snapshot);
    const productId = this.route.snapshot.paramMap.get('id');
    console.log('productId', productId);
    this.product = this.productService.getProduct(productId);

    this.ci = this.cartItemService.getCartItem(this.product.id);
    if(this.ci) {
      this.qtyInCart = this.ci.quantity;
    }

    this.qtyItems = this.cartItemService.getQtyCartItems();
    this.calcPrice();

  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../providers/product-service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

  product: Product;

//  constructor() { }
  constructor(private route: ActivatedRoute, public productService: ProductService) {
  }
  ngOnInit() {
  }

  ionViewWillEnter() {
    // console.log('ionViewWillEnter');
    // console.log('this.route.snapshot', this.route.snapshot);
    const productId = this.route.snapshot.paramMap.get('id');
    console.log('productId', productId);
    this.product = this.productService.getProduct(productId);
  }
}

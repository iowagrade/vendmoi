import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-productDetail',
    templateUrl: 'pageProductDetail.html',
})
export class PageProductDetail {

    product: {};

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.product = navParams.get('product');
    }
}
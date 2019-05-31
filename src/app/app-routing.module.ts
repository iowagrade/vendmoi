import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  //{ path: '', redirectTo: 'login', pathMatch:'full'},
  //{ path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'home', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'rx', loadChildren: './rx/rx.module#RxPageModule' },
  { path: 'create-account', loadChildren: './create-account/create-account.module#CreateAccountPageModule' },
  { path: 'product-detail/:id', loadChildren: './product-detail/product-detail.module#ProductDetailPageModule' },
  { path: 'map', loadChildren: './map/map.module#MapPageModule' },
  { path: 'shopping-cart', loadChildren: './shopping-cart/shopping-cart.module#ShoppingCartPageModule' },
  { path: 'payment', loadChildren: './payment/payment.module#PaymentPageModule' },
  { path: 'check-out', loadChildren: './check-out/check-out.module#CheckOutPageModule' },
  { path: 'thank-you', loadChildren: './thank-you/thank-you.module#ThankYouPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

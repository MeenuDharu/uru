import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RestaurantGuard } from './_guards/restaurant.guard';
import { UserGuard } from './_guards/user.guard';
import { EndGuard } from './_guards/end.guard';

const routes: Routes = [
  // { path: '', redirectTo: "/scan", pathMatch: "full" },

  { path: '', loadChildren: () => import('./modules/scan/scan.module').then(m => m.ScanModule)},

  { path: 'password-recovery/:token', loadChildren: () => import('./modules/pwd-recovery/pwd-recovery.module').then(m => m.PwdRecoveryModule) },
  { path: 'confirm_user_email/:id', loadChildren: () => import('./modules/confirm-email/confirm-email.module').then(m => m.ConfirmEmailModule) },
  { path: 'checkout/payment-confirm', loadChildren: () => import('./modules/payment/payment.module').then(m => m.PaymentModule)},
  { path: 'social/authentication', loadChildren: () => import('./modules/social-auth/social-auth.module').then(m => m.SocialAuthModule)},

  { path: 'myorder', loadChildren: () => import('./modules/myorder/myorder.module').then(m => m.MyorderModule) },
  { path: 'pickup', loadChildren: () => import('./modules/pickup/pickup.module').then(m => m.PickupModule) },

  { path: 'home', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule), canActivate: [RestaurantGuard, EndGuard] },

  { path: 'menu/categories', loadChildren: () => import('./modules/menu/categories/categories.module').then(m => m.CategoriesModule), canActivate: [RestaurantGuard, EndGuard] },
  { path: 'menu/sections', loadChildren: () => import('./modules/menu/sections/sections.module').then(m => m.SectionsModule), canActivate: [RestaurantGuard, EndGuard] },
  { path: 'menu/items', loadChildren: () => import('./modules/menu/items/items.module').then(m => m.ItemsModule), canActivate: [RestaurantGuard, EndGuard] },
  { path: 'menu/item/customization', loadChildren: () => import('./modules/menu/item-customization/item-customization.module').then(m => m.ItemCustomizationModule), canActivate: [RestaurantGuard, EndGuard] },

  { path: 'cart/:type', loadChildren: () => import('./modules/cart/cart.module').then(m => m.CartModule), canActivate: [RestaurantGuard, EndGuard] },

  { path: 'bill/view', loadChildren: () => import('./modules/bill/bill-view/bill-view.module').then(m => m.BillViewModule), canActivate: [RestaurantGuard, UserGuard, EndGuard] },
  { path: 'bill/type', loadChildren: () => import('./modules/bill/bill-type/bill-type.module').then(m => m.BillTypeModule), canActivate: [RestaurantGuard, UserGuard, EndGuard] },
  { path: 'bill/confirm',loadChildren: () => import('./modules/bill/bill-confirm/bill-confirm.module').then(m => m.BillConfirmModule), canActivate: [RestaurantGuard, UserGuard] },

  { path: 'valet-android', loadChildren: () => import('./modules/valet/valet-android/valet-android.module').then(m => m.ValetAndroidModule), canActivate: [RestaurantGuard, UserGuard] },
  { path: 'valet-ios', loadChildren: () => import('./modules/valet/valet-ios/valet-ios.module').then(m => m.ValetIosModule), canActivate: [RestaurantGuard, UserGuard] },
  { path: 'valet/details/:id', loadChildren: () => import('./modules/valet/valet-details/valet-details.module').then(m => m.ValetDetailsModule), canActivate: [RestaurantGuard, UserGuard] },
  { path: 'valet/status', loadChildren: () => import('./modules/valet/valet-status/valet-status.module').then(m => m.ValetStatusModule), canActivate: [RestaurantGuard, UserGuard] },

  { path: 'feedback', loadChildren: () => import('./modules/feedback/feedback.module').then(m => m.FeedbackModule), canActivate: [RestaurantGuard, UserGuard] },
  { path: 'offers', loadChildren: () => import('./modules/offers/offers.module').then(m => m.OffersModule), canActivate: [RestaurantGuard, EndGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot([], { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
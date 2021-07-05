import { Routes } from '@angular/router';
import { RestaurantGuard } from '../_guards/restaurant.guard';
import { EndGuard } from '../_guards/end.guard';
import { UserGuard } from '../_guards/user.guard';
// import { cart_routes } from './cart/cart.routing.module';

export const routes: Routes = [
  // { path: '', redirectTo: "/scan", pathMatch: "full" },

  { path: '', loadChildren: () => import('./scan/scan.module').then(m => m.ScanModule)},

  { path: 'password-recovery/:token', loadChildren: () => import('./pwd-recovery/pwd-recovery.module').then(m => m.PwdRecoveryModule) },
  { path: 'confirm_user_email/:id', loadChildren: () => import('./confirm-email/confirm-email.module').then(m => m.ConfirmEmailModule) },
  { path: 'checkout/payment-confirm', loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule)},
  { path: 'social/authentication', loadChildren: () => import('./social-auth/social-auth.module').then(m => m.SocialAuthModule)},

  { path: 'myorder', loadChildren: () => import('./myorder/myorder.module').then(m => m.MyorderModule) },
  { path: 'pickup', loadChildren: () => import('./pickup/pickup.module').then(m => m.PickupModule) },

  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule), canActivate: [RestaurantGuard, EndGuard] },

  { path: 'menu/categories', loadChildren: () => import('./menu/categories/categories.module').then(m => m.CategoriesModule), canActivate: [RestaurantGuard, EndGuard] },
  { path: 'menu/sections', loadChildren: () => import('./menu/sections/sections.module').then(m => m.SectionsModule), canActivate: [RestaurantGuard, EndGuard] },
  { path: 'menu/items', loadChildren: () => import('./menu/items/items.module').then(m => m.ItemsModule), canActivate: [RestaurantGuard, EndGuard] },
  { path: 'menu/item/customization', loadChildren: () => import('./menu/item-customization/item-customization.module').then(m => m.ItemCustomizationModule), canActivate: [RestaurantGuard, EndGuard] },

  { path: 'cart/:type', loadChildren: () => import('./cart/cart.module').then(m => m.CartModule), canActivate: [RestaurantGuard, EndGuard] },

  { path: 'bill/view', loadChildren: () => import('./bill/bill-view/bill-view.module').then(m => m.BillViewModule), canActivate: [RestaurantGuard, UserGuard, EndGuard] },
  { path: 'bill/type', loadChildren: () => import('./bill/bill-type/bill-type.module').then(m => m.BillTypeModule), canActivate: [RestaurantGuard, UserGuard, EndGuard] },
  { path: 'bill/confirm',loadChildren: () => import('./bill/bill-confirm/bill-confirm.module').then(m => m.BillConfirmModule), canActivate: [RestaurantGuard, UserGuard, EndGuard] },

  { path: '', loadChildren: () => import('./valet/valet.module').then(m => m.ValetModule)},

  //{ path: 'valet-android', loadChildren: () => import('./valet/valet-android/valet-android.module').then(m => m.ValetAndroidModule), canActivate: [RestaurantGuard, UserGuard] },
 // { path: 'valet-ios', loadChildren: () => import('./valet/valet-ios/valet-ios.module').then(m => m.ValetIosModule), canActivate: [RestaurantGuard, UserGuard] },
//  { path: 'valet/details/:id', loadChildren: () => import('./valet/valet-details/valet-details.module').then(m => m.ValetDetailsModule), canActivate: [RestaurantGuard, UserGuard] },
  { path: 'valet/status', loadChildren: () => import('./valet/valet-status/valet-status.module').then(m => m.ValetStatusModule) },

  { path: 'feedback', loadChildren: () => import('./feedback/feedback.module').then(m => m.FeedbackModule), canActivate: [RestaurantGuard, UserGuard] },
  { path: 'offers', loadChildren: () => import('./offers/offers.module').then(m => m.OffersModule), canActivate: [RestaurantGuard, EndGuard] },
  
  // need to check 
  { path: 'order-status', loadChildren: () => import('./cart/order-status/order-status.module').then( m => m.OrderStatusModule), canActivate:[ RestaurantGuard, UserGuard, EndGuard]},
  { path: 'takeaway-order/:id', loadChildren: () => import('./cart/takeaway-order/takeaway-order.module').then( m => m.TakeawayOrderModule) },
  { path: 'live-order/:id', loadChildren: () => import('./cart/live-order/live-order.module').then( m => m.LiveOrderModule) },
  { path: 'completed-order/:id', loadChildren: () => import('./cart/completed-order/completed-order.module').then( m => m.CompletedOrderModule) },
  { path: 'view-order', loadChildren: () => import('./cart/view-order/view-order.module').then( m => m.ViewOrderModule), canActivate:[ RestaurantGuard, UserGuard]},
  // ...cart_routes
];
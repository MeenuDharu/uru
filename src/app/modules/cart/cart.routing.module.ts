import { Routes } from '@angular/router';
import { CartComponent } from './cart.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { RestaurantGuard } from 'src/app/_guards/restaurant.guard';
import { UserGuard } from 'src/app/_guards/user.guard';
import { EndGuard } from 'src/app/_guards/end.guard';

export const cart_routes : Routes = [
    { path:'', component: CartComponent},
    { path: 'order-status', loadChildren: () => import('./order-status/order-status.module').then( m => m.OrderStatusModule), canActivate:[ RestaurantGuard, UserGuard, EndGuard]},
    { path: 'takeaway-order/:id', loadChildren: () => import('./takeaway-order/takeaway-order.module').then( m => m.TakeawayOrderModule), canActivate:[ RestaurantGuard, UserGuard, EndGuard]},
    { path: 'live-order/:id', loadChildren: () => import('./live-order/live-order.module').then( m => m.LiveOrderModule), canActivate:[ RestaurantGuard, UserGuard, EndGuard] },
    { path: 'completed-order/:id', loadChildren: () => import('./completed-order/completed-order.module').then( m => m.CompletedOrderModule) , canActivate:[ RestaurantGuard, UserGuard, EndGuard]},
    { path: 'view-order', loadChildren: () => import('./view-order/view-order.module').then( m => m.ViewOrderModule), canActivate:[ RestaurantGuard, UserGuard, EndGuard]},    
]
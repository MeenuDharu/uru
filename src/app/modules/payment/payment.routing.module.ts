import { Routes } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { RestaurantGuard } from 'src/app/_guards/restaurant.guard';
import { UserGuard } from 'src/app/_guards/user.guard';
import { EndGuard } from 'src/app/_guards/end.guard';

export const payment_routes : Routes = [
    { path: '', component: PaymentComponent},
    // { path: 'order-status', loadChildren: () => import('../cart/order-status/order-status.module').then( m => m.OrderStatusModule), canActivate:[ RestaurantGuard, UserGuard, EndGuard]},
]
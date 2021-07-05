import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule, MatCardModule } from '@angular/material';
import { IosNotifyComponent } from '../../ios-notify/ios-notify.component';
import { IosNotifyModule } from '../../ios-notify/ios-notify.module';
import { LiveOrderComponent } from './live-order.component';
import { live_order_routes } from './live-order-routing.module';


@NgModule({
  declarations: [LiveOrderComponent],
  imports: [
    CommonModule,
    CommonModule,    
    RouterModule.forChild(live_order_routes),
    ModalModule.forRoot(),
    FormsModule,
    MatProgressSpinnerModule, MatCardModule,
    IosNotifyModule
  ]
})
export class LiveOrderModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { order_status_routes } from './order-status.routing.module';
import { OrderStatusComponent } from './order-status.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { IosNotifyComponent } from '../../ios-notify/ios-notify.component';
import { IosNotifyModule } from '../../ios-notify/ios-notify.module';


@NgModule({
  declarations: [
    OrderStatusComponent    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(order_status_routes),
    ModalModule.forRoot(),
    FormsModule,
    IosNotifyModule
  ]
})
export class OrderStatusModule { }

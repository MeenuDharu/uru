import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { completed_order_routes } from './completed-order-routing.module';
import { CompletedOrderComponent } from './completed-order.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule, MatCardModule } from '@angular/material';
import { IosNotifyComponent } from '../../ios-notify/ios-notify.component';
import { IosNotifyModule } from '../../ios-notify/ios-notify.module';


@NgModule({
  declarations: [CompletedOrderComponent],
  imports: [
    CommonModule,    
    RouterModule.forChild(completed_order_routes),
    ModalModule.forRoot(),
    FormsModule,
    MatProgressSpinnerModule, MatCardModule,
    IosNotifyModule
  ]
})
export class CompletedOrderModule { }

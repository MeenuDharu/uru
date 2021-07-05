import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeaway_order_routes } from './takeaway-order.routing.module';
import { TakeawayOrderComponent } from './takeaway-order.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule, MatCardModule } from '@angular/material';
import { IosNotifyComponent } from '../../ios-notify/ios-notify.component';
import { IosNotifyModule } from '../../ios-notify/ios-notify.module';


@NgModule({
  declarations: [
    TakeawayOrderComponent    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(takeaway_order_routes),
    ModalModule.forRoot(),
    FormsModule,
    MatProgressSpinnerModule, MatCardModule,
    IosNotifyModule
  ]
})
export class TakeawayOrderModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { view_order_routes } from './view-order.routing.module';
import { ViewOrderComponent } from './view-order.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule, MatCardModule } from '@angular/material';
import { IosNotifyComponent } from '../../ios-notify/ios-notify.component';
import { IosNotifyModule } from '../../ios-notify/ios-notify.module';
// import { ios_routes } from '../../scan/ios/ios.routing.module';



@NgModule({
  declarations: [
    ViewOrderComponent    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(view_order_routes),
    ModalModule.forRoot(),
    FormsModule,
    MatProgressSpinnerModule, MatCardModule,
    IosNotifyModule    
  ]
})
export class ViewOrderModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { bill_view_routes } from './bill-view.routing.module';
import { BillViewComponent } from './bill-view.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule, MatCardModule } from '@angular/material';
import { IosNotifyComponent } from '../../ios-notify/ios-notify.component';
import { IosNotifyModule } from '../../ios-notify/ios-notify.module';


@NgModule({
  declarations: [
    BillViewComponent    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(bill_view_routes),
    ModalModule.forRoot(),
    FormsModule,
    MatProgressSpinnerModule, MatCardModule,
    IosNotifyModule
  ]
})
export class BillViewModule { }

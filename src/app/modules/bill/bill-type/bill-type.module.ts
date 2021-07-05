import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { bill_type_routes } from './bill-type.routing.module';
import { BillTypeComponent } from './bill-type.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { IosNotifyComponent } from '../../ios-notify/ios-notify.component';
import { IosNotifyModule } from '../../ios-notify/ios-notify.module';
import {CurrencyPipe} from '@angular/common'

@NgModule({
  declarations: [
    BillTypeComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(bill_type_routes),
    ModalModule.forRoot(),
    FormsModule,
    IosNotifyModule,
    
  ],
  providers: [CurrencyPipe]
})
export class BillTypeModule { }

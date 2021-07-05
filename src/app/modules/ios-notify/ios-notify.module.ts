import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IosNotifyComponent } from './ios-notify.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { OrderByPipe } from 'src/app/_pipes/order-by.pipe';
import { SearchFilterPipe } from 'src/app/_pipes/search-filter.pipe';
import { MyFilterPipe } from 'src/app/_pipes/my-filter.pipe';
import { RailwayToLocalPipe } from 'src/app/_pipes/railway-to-local.pipe';
import { OrderDescPipe } from 'src/app/_pipes/order-desc.pipe';



@NgModule({
  declarations: [ 
    IosNotifyComponent,
    OrderByPipe,
    SearchFilterPipe,
    MyFilterPipe,
    RailwayToLocalPipe,
    OrderDescPipe
  ],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    FormsModule
  ],
  exports: [ 
    IosNotifyComponent,
    OrderByPipe,
    SearchFilterPipe,
    MyFilterPipe,
    RailwayToLocalPipe,
    OrderDescPipe
  ]
})
export class IosNotifyModule { }

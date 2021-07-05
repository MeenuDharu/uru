import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { valet_details_routes } from './valet-details.routing.module';
import { ValetDetailsComponent } from './valet-details.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { IosNotifyComponent } from '../../ios-notify/ios-notify.component';
import { IosNotifyModule } from '../../ios-notify/ios-notify.module';


@NgModule({
  declarations: [
    ValetDetailsComponent    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(valet_details_routes),
    ModalModule.forRoot(),
    FormsModule,
    IosNotifyModule
  ]
})
export class ValetDetailsModule { }

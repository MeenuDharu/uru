import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { valet_ios_routes } from './valet-ios.routing.modul';
import { ValetIosComponent } from './valet-ios.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { IosNotifyComponent } from '../../ios-notify/ios-notify.component';
import { IosNotifyModule } from '../../ios-notify/ios-notify.module';


@NgModule({
  declarations: [
    ValetIosComponent    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(valet_ios_routes),
    ModalModule.forRoot(),
    FormsModule,
    IosNotifyModule
  ]
})
export class ValetIosModule { }

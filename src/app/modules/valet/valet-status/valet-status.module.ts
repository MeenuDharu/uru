import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { valet_status_routes } from './valet-status.routing.module';
import { ValetStatusComponent } from './valet-status.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { IosNotifyComponent } from '../../ios-notify/ios-notify.component';
import { IosNotifyModule } from '../../ios-notify/ios-notify.module';
import { CountdownModule } from 'ngx-countdown';
import {ProgressBarModule} from "angular-progress-bar"


@NgModule({
  declarations: [
    ValetStatusComponent    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(valet_status_routes),
    ModalModule.forRoot(),
    FormsModule,
    IosNotifyModule,
    CountdownModule,
    ProgressBarModule    
  ]
})
export class ValetStatusModule { }

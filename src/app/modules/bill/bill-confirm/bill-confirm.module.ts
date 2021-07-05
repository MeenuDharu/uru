import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { bill_confirm_routes } from './bill-confirm.routing.module';
import { BillConfirmComponent } from './bill-confirm.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material';
import { IosNotifyComponent } from '../../ios-notify/ios-notify.component';
import { IosNotifyModule } from '../../ios-notify/ios-notify.module';
import { CountdownModule } from 'ngx-countdown';
import {ProgressBarModule} from "angular-progress-bar"
import {CurrencyPipe} from '@angular/common'
//import { LogoImgBrokenDirective } from 'src/app/_directives/logo-img-broken.directive';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  declarations: [
    BillConfirmComponent,
  
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(bill_confirm_routes),
    ModalModule.forRoot(),
    FormsModule,
    MatProgressSpinnerModule,
    IosNotifyModule,
    ProgressBarModule,
    CountdownModule,
    SharedModule

  ],
  providers: [CurrencyPipe]
})
export class BillConfirmModule { }

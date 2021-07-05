import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { offer_routes } from './offers.routing.module';
import { OffersComponent } from './offers.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { IosNotifyComponent } from '../ios-notify/ios-notify.component';
import { IosNotifyModule } from '../ios-notify/ios-notify.module';
import { MatCardModule, MatFormFieldModule, MatInputModule } from '@angular/material';


@NgModule({
  declarations: [
    OffersComponent    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(offer_routes),
    ModalModule.forRoot(),
    FormsModule,
    IosNotifyModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
  ]
})
export class OffersModule { }

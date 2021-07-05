import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { pickup_routes } from './pickup.routing.module';
import { PickupComponent } from './pickup.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material';
import { IosNotifyComponent } from '../ios-notify/ios-notify.component';
import { IosNotifyModule } from '../ios-notify/ios-notify.module';



@NgModule({
  declarations: [
    PickupComponent    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(pickup_routes),
    ModalModule.forRoot(),
    FormsModule,
    MatProgressSpinnerModule,
    IosNotifyModule
  ]
})
export class PickupModule { }

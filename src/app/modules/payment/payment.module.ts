import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { payment_routes } from './payment.routing.module';
import { PaymentComponent } from './payment.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PaymentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(payment_routes),
    ModalModule.forRoot(),
    FormsModule
  ]
})
export class PaymentModule { }

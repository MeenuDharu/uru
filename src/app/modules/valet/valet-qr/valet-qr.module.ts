
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { valetqr_routes } from  './valet-qr.routing.module';
import { ValetQrComponent } from './valet-qr.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ValetQrComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(valetqr_routes),
    ModalModule.forRoot(),
    FormsModule
  ]
})
export class ValetQrModule { }

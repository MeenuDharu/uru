import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { qr_routes } from './qr.routing.module';
import { QrComponent } from './qr.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    QrComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(qr_routes),
    ModalModule.forRoot(),
    FormsModule
  ]
})
export class QrModule { }

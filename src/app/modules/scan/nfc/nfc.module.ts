import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { nfc_routes } from './nfc.routing.module';
import { NfcComponent } from './nfc.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    NfcComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(nfc_routes),
    ModalModule.forRoot(),
    FormsModule
  ]
})
export class NfcModule { }

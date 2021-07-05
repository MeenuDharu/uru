import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScanComponent } from '../scan/scan.component';
import { RouterModule } from '@angular/router';
import { scan_routes } from './scan.routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ScanComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(scan_routes),
    ModalModule.forRoot(),
    FormsModule
  ]
})
export class ScanModule { }

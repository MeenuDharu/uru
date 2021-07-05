import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValetComponent } from '../valet/valet.component';
import { RouterModule } from '@angular/router';
import { valetScan_routes } from  './valet.routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ValetComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(valetScan_routes),
    ModalModule.forRoot(),
    FormsModule
  ]
})

export class ValetModule { }






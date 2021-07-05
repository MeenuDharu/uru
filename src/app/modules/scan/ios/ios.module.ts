import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ios_routes } from './ios.routing.module';
import { IosComponent } from './ios.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    IosComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ios_routes),
    ModalModule.forRoot(),
    FormsModule
  ]
})
export class IosModule { }

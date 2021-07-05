import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { confirm_email_routes } from './confirm-email.routing.module';
import { ConfirmEmailComponent } from './confirm-email.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ConfirmEmailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(confirm_email_routes),
    ModalModule.forRoot(),
    FormsModule
  ]
})
export class ConfirmEmailModule { }

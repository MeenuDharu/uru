import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { social_auth_routes } from './social-auth.routing.module';
import { SocialAuthComponent } from './social-auth.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SocialAuthComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(social_auth_routes),
    ModalModule.forRoot(),
    FormsModule
  ]
})
export class SocialAuthModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { feedback_routes } from './feedback.routing.module';
import { FeedbackComponent } from './feedback.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { IosNotifyComponent } from '../ios-notify/ios-notify.component';
import { IosNotifyModule } from '../ios-notify/ios-notify.module';
import { MatCardModule } from '@angular/material';


@NgModule({
  declarations: [
    FeedbackComponent    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(feedback_routes),
    ModalModule.forRoot(),
    FormsModule,
    IosNotifyModule,
    MatCardModule
  ]
})
export class FeedbackModule { }

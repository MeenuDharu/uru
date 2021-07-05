import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { myorder_routes } from './myorder.routing.module';
import { MyorderComponent } from './myorder.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { UnicodeFilerPipe } from 'src/app/_pipes/unicode-filer.pipe';
import { MatCardModule } from '@angular/material';


@NgModule({
  declarations: [
    MyorderComponent,
    UnicodeFilerPipe
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(myorder_routes),
    ModalModule.forRoot(),
    FormsModule,
    MatCardModule
  ]
})
export class MyorderModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { cart_routes } from './cart.routing.module';
import { CartComponent } from './cart.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatProgressSpinnerModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule, MatFormFieldModule, MatInputModule, MatRippleModule, MatSnackBarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { IosNotifyComponent } from '../ios-notify/ios-notify.component';
import { IosNotifyModule } from '../ios-notify/ios-notify.module';


@NgModule({
  declarations: [
    CartComponent    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(cart_routes),
    ModalModule.forRoot(),
    FormsModule,
    IosNotifyModule,
    MatProgressSpinnerModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule, MatFormFieldModule, MatInputModule, MatRippleModule, MatSnackBarModule
  ]
})
export class CartModule { }

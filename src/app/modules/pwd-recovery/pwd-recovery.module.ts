import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { pwdrecovery_routes } from './pwd-recovery.routing.module';
import { PwdRecoveryComponent } from './pwd-recovery.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatProgressSpinnerModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule, MatFormFieldModule, MatInputModule, MatRippleModule, MatSnackBarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PwdRecoveryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(pwdrecovery_routes),
    ModalModule.forRoot(),
    FormsModule,
    MatProgressSpinnerModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule, MatFormFieldModule, MatInputModule, MatRippleModule, MatSnackBarModule
  ]
})
export class PwdRecoveryModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { android_routes } from './android.routing.module';
import { AndroidComponent } from './android.component';
// import { ZXingScannerModule } from '../../zxing-scanner/zxing-scanner.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
// import { ZXingScannerModule } from '@zxing/ngx-scanner';


@NgModule({
  declarations: [AndroidComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(android_routes),
    // ZXingScannerModule,
    ModalModule.forRoot(),
    FormsModule,
    SharedModule
  ]
})
export class AndroidModule { }

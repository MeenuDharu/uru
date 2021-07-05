import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { valet_android_routes } from './valet-android.routing.module';
import { ValetAndroidComponent } from './valet-android.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { IosNotifyComponent } from '../../ios-notify/ios-notify.component';
import { IosNotifyModule } from '../../ios-notify/ios-notify.module';
import { SharedModule } from '../../shared/shared.module';
// import { ZXingScannerModule } from '@zxing/ngx-scanner';



@NgModule({
  declarations: [
    ValetAndroidComponent    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(valet_android_routes),
    ModalModule.forRoot(),
    FormsModule,
    IosNotifyModule,
    SharedModule
  ]
})
export class ValetAndroidModule { }

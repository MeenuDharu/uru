import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { items_routes } from './items.routing.module';
import { ItemsComponent } from './items.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { IosNotifyComponent } from '../../ios-notify/ios-notify.component';
import { IosNotifyModule } from '../../ios-notify/ios-notify.module';
import { OrderByPipe } from 'src/app/_pipes/order-by.pipe';
import { MatCardModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { TulsiImgDirective } from 'src/app/_directives/tulsi-img.directive';
import { SharedModule } from '../../shared/shared.module';
// import lazySizes from 'lazysizes';
// import 'lazysizes/plugins/attrchange/ls.attrchange';
// import 'lazysizes/plugins/parent-fit';
// import 'lazysizes/plugins/rias'
// import 'lazysizes/parent-fit/ls.parent-fit';


@NgModule({
  declarations: [
    ItemsComponent,
    // OrderByPipe   
    TulsiImgDirective,    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(items_routes),
    ModalModule.forRoot(),
    FormsModule,
    IosNotifyModule,SharedModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    LazyLoadImageModule.forRoot({ preset: intersectionObserverPreset}),
    // lazySizes
  ]
})
export class ItemsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { items_routes } from '../items/items.routing.module';
import { item_customization_routes } from './item-customization.routing.module';
import { ItemCustomizationComponent } from './item-customization.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { IosNotifyComponent } from '../../ios-notify/ios-notify.component';
import { IosNotifyModule } from '../../ios-notify/ios-notify.module';
import { MatFormFieldModule, MatInputModule } from '@angular/material';



@NgModule({
  declarations: [
    ItemCustomizationComponent    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(item_customization_routes),
    ModalModule.forRoot(),
    FormsModule,
    IosNotifyModule,
    MatFormFieldModule , MatInputModule
  ]
})
export class ItemCustomizationModule { }

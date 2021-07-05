import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { categories_routes } from './categories.routing.module';
import { CategoriesComponent } from './categories.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatProgressSpinnerModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule, MatFormFieldModule, MatInputModule, MatRippleModule, MatSnackBarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { IosNotifyComponent } from '../../ios-notify/ios-notify.component';
import { IosNotifyModule } from '../../ios-notify/ios-notify.module';
import { OrderByPipe } from 'src/app/_pipes/order-by.pipe';
import { CatImgBrokenDirective } from 'src/app/_directives/cat-img-broken.directive';

@NgModule({
  declarations: [
    CategoriesComponent,
    CatImgBrokenDirective
    // OrderByPipe 
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(categories_routes),
    ModalModule.forRoot(),
    FormsModule,
    IosNotifyModule,
    MatProgressSpinnerModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule, MatFormFieldModule, MatInputModule, MatRippleModule, MatSnackBarModule
  ]
})
export class CategoriesModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { home_routes } from './home.routing.module';
import { HomeComponent } from './home.component';
import { ModalModule } from 'ngx-bootstrap/modal';
// import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { MatProgressSpinnerModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule, MatFormFieldModule, MatInputModule, MatRippleModule, MatSnackBarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { IosNotifyComponent } from '../ios-notify/ios-notify.component';
import { IosNotifyModule } from '../ios-notify/ios-notify.module';
import { environment } from 'src/environments/environment.prod';
//import { LogoImgBrokenDirective } from 'src/app/_directives/logo-img-broken.directive';
import { SharedModule } from './../shared/shared.module';
import {ProgressBarModule} from "angular-progress-bar"
import { CountdownModule } from 'ngx-countdown';
import { HomeSwiperDirective } from './directives/home-swiper.directive';
import { PopupSwiperDirective } from './directives/popup-swiper.directive';
@NgModule({
  declarations: [
    HomeComponent,
    HomeSwiperDirective,
    PopupSwiperDirective
  //  LogoImgBrokenDirective    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(home_routes),
    ModalModule.forRoot(),
    FormsModule,
    IosNotifyModule,SharedModule,
    ProgressBarModule,
    CountdownModule,
    MatProgressSpinnerModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule, MatFormFieldModule, MatInputModule, MatRippleModule, MatSnackBarModule
  ]
})
export class HomeModule { }

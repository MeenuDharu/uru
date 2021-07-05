 import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { MatProgressSpinnerModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule, MatFormFieldModule, MatInputModule, MatRippleModule, MatSnackBarModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { MatKeyboardModule } from '@ngx-material-keyboard/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: environment.socket_url, options: environment.socket_options };

import { SocketService } from './_services/socket.service';
import { UserService } from './_services/user.service';
import { ApiService } from './_services/api.service';
import { CommonService } from './_services/common.service';
import { MenuStorageService } from './_services/menu-storage.service';
import { QrcodeReaderService } from './_services/qrcode-reader.service';
import { SnackbarService } from './_services/snackbar.service';
import { WindowRef } from './_services/winref.service';
import { RouterModule } from '@angular/router';
import { routes } from './modules/app.routing';
import { FilterAnimationDirective } from './_directives/filter-animation.directive';
import { CookieService } from 'ngx-cookie-service';
import { ScrolltoelemDirective } from './_directives/scrolltoelem.directive';
// import { PopupMgBrokenDirective } from './_directives/popup-mg-broken.directive';
//import { MenuSectionImgBrokenDirective } from './_directives/menu-section-img-broken.directive';
// import { LqimgLoadDirective } from './_directives/lqimg-load.directive';

// import { DeferLoadDirective } from './_directives/defer-load.directive';

// import { LogoImgBrokenDirective } from './_directives/logo-img-broken.directive';
//import { ItemImgBrokenDirective } from './_directives/item-img-broken.directive';
// import { CatImgBrokenDirective } from './_directives/cat-img-broken.directive';

// import { LazyloadDirective } from './_directives/lazyload.directive';
// import { TulsiImgDirective } from './_directives/tulsi-img.directive';
// import { CartModule } from './modules/cart/cart.module';


// Configs 
export function getAuthServiceConfigs() {
  if(environment.production) {
    return new AuthServiceConfig([
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider("319677579381843")
      },
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        // provider: new GoogleLoginProvider("871981474086-58qnk8ohtg54olrab3n730lfgj46omrc.apps.googleusercontent.com")  
      //  //care.dinamic.io   
      //   provider: new GoogleLoginProvider("1098710898816-ouub7k9m0836hcvdr1ebm6nuj1cq0njp.apps.googleusercontent.com")
          //mob.dinamic.io
        // provider: new GoogleLoginProvider("1098710898816-gsv32hi153b9vj3p96928sh30nkongsu.apps.googleusercontent.com")
           provider: new GoogleLoginProvider("523119267952-kubva6l7074l6cds6v527stmrb787g1n.apps.googleusercontent.com")

      }
    ]);
  }
  else {
    return new AuthServiceConfig([
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider("319677579381843")
      },
      {
        id: GoogleLoginProvider.PROVIDER_ID,
      // //care.dinamic.io
      //  provider: new GoogleLoginProvider("1098710898816-ouub7k9m0836hcvdr1ebm6nuj1cq0njp.apps.googleusercontent.com")
        //mob.dinamic.io
       // provider: new GoogleLoginProvider("1098710898816-gsv32hi153b9vj3p96928sh30nkongsu.apps.googleusercontent.com")
        
     provider: new GoogleLoginProvider("523119267952-kubva6l7074l6cds6v527stmrb787g1n.apps.googleusercontent.com")
      }
    ]);
  }
}

// import { WindowRef } from './WindowRef';

@NgModule({
  declarations: [
    AppComponent,
    FilterAnimationDirective,
    ScrolltoelemDirective,
    // PopupMgBrokenDirective
   // MenuSectionImgBrokenDirective,
   // LqimgLoadDirective,
   
    // DeferLoadDirective,
   // LogoImgBrokenDirective,
    // ItemImgBrokenDirective,
    // CatImgBrokenDirective,
  
    // LazyloadDirective,
    // TulsiImgDirective
  ],
  imports: [
    BrowserModule,   
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
   
    // CartModule,
    MatKeyboardModule,
    MatProgressSpinnerModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule, MatFormFieldModule, MatInputModule, MatRippleModule, MatSnackBarModule,
    SocialLoginModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    SocketIoModule.forRoot(config),
    DeviceDetectorModule.forRoot(),    
    RouterModule.forRoot(routes, { useHash: true }),
    LazyLoadImageModule.forRoot({ preset: intersectionObserverPreset })
  ],
  providers: [
    { provide: AuthServiceConfig, useFactory: getAuthServiceConfigs },
    CookieService,
  SocketService, UserService, ApiService, CommonService, MenuStorageService, QrcodeReaderService, SnackbarService, WindowRef],
  bootstrap: [AppComponent]
})
export class AppModule { }
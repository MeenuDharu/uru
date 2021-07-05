import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '../zxing-scanner/zxing-scanner.module';
import { LogoImgBrokenDirective } from 'src/app/_directives/logo-img-broken.directive';
import { LazyloadDirective } from 'src/app/_directives/lazyload.directive';
import { ItemImgBrokenDirective } from 'src/app/_directives/item-img-broken.directive';
import { DeferLoadDirective } from 'src/app/_directives/defer-load.directive';
import { LqimgLoadDirective } from 'src/app/_directives/lqimg-load.directive';
import { MenuSectionImgBrokenDirective } from 'src/app/_directives/menu-section-img-broken.directive';
import { PopupMgBrokenDirective } from 'src/app/_directives/popup-mg-broken.directive';
@NgModule({
  declarations: [LogoImgBrokenDirective,MenuSectionImgBrokenDirective ,
    ItemImgBrokenDirective,PopupMgBrokenDirective,
    DeferLoadDirective,
    LqimgLoadDirective,LazyloadDirective],
  imports: [
    CommonModule
  ],
  exports:[
    ZXingScannerModule,
    LogoImgBrokenDirective ,
    PopupMgBrokenDirective,
    MenuSectionImgBrokenDirective,
    ItemImgBrokenDirective,
    DeferLoadDirective,
    LqimgLoadDirective,
    LazyloadDirective
    
  ]
})
export class SharedModule { }

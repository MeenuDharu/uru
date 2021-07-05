import { Routes } from "@angular/router";
import { ValetComponent } from './valet.component';
import { RestaurantGuard } from 'src/app/_guards/restaurant.guard';
import { UserGuard } from 'src/app/_guards/user.guard';
import { EndGuard } from 'src/app/_guards/end.guard';
// const routes: Routes = [];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class ValetRoutingModule { }

export const valetScan_routes: Routes = [
  { path:'', component: ValetComponent },
  { path:'valet-android', loadChildren: () => import('./valet-android/valet-android.module').then(m => m.ValetAndroidModule), canActivate:[ RestaurantGuard ]},
  // { path: 'ios', loadChildren: () => import('./ios/ios.module').then(m => m.IosModule)},
  { path: 'vq/:code', loadChildren: () => import('./valet-qr/valet-qr.module').then(m => m.ValetQrModule), canActivate:[ RestaurantGuard ]},
  { path: 'valet/status', loadChildren: () => import('./valet-status/valet-status.module').then(m => m.ValetStatusModule), canActivate:[ RestaurantGuard ]},
  // { path: 'n/:code', loadChildren: () => import('./nfc/nfc.module').then(m => m.NfcModule)}
]
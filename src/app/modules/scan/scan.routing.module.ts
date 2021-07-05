import { Routes } from "@angular/router";
import { ScanComponent } from './scan.component';

export const scan_routes: Routes = [
    { path:'', component: ScanComponent },
    { path:'android', loadChildren: () => import('./android/android.module').then(m => m.AndroidModule)},
    { path: 'ios', loadChildren: () => import('./ios/ios.module').then(m => m.IosModule)},
    { path: 'q/:code', loadChildren: () => import('./qr/qr.module').then(m => m.QrModule)},
    { path: 'n/:code', loadChildren: () => import('./nfc/nfc.module').then(m => m.NfcModule)}
]



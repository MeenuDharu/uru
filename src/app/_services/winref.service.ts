import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class WinrefService {

//   constructor() { }
// }

@Injectable()
export class WindowRef {
    get nativeWindow(): any {
        return _window();
    }
}

function _window(): any {
    // return the global native browser window object
    return window;
}


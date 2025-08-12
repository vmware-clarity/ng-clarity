import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class FocusService {
    private _focused;
    get focusChange(): Observable<boolean>;
    set focused(state: boolean);
    static ɵfac: i0.ɵɵFactoryDeclaration<FocusService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FocusService>;
}

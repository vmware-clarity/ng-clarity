import { AfterViewChecked } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class WillyWonka implements AfterViewChecked {
    disableChocolateCheck: boolean;
    private _chocolate;
    get chocolate(): Observable<void>;
    ngAfterViewChecked(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WillyWonka, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<WillyWonka, never, never, {}, {}, never, never, false, never>;
}

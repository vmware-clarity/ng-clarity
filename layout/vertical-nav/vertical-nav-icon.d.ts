import { OnDestroy } from '@angular/core';
import { VerticalNavIconService } from './providers/vertical-nav-icon.service';
import * as i0 from "@angular/core";
export declare class ClrVerticalNavIcon implements OnDestroy {
    private _verticalNavIconService;
    constructor(_verticalNavIconService: VerticalNavIconService);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrVerticalNavIcon, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrVerticalNavIcon, "[clrVerticalNavIcon]", never, {}, {}, never, never, false, never>;
}

import { ChangeDetectorRef, ElementRef, OnDestroy } from '@angular/core';
import { VerticalNavGroupService } from './providers/vertical-nav-group.service';
import * as i0 from "@angular/core";
export declare class ClrVerticalNavLink implements OnDestroy {
    private destroy$;
    constructor(host: ElementRef<HTMLElement>, ref: ChangeDetectorRef, navGroupService: VerticalNavGroupService | null);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrVerticalNavLink, [null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrVerticalNavLink, "[clrVerticalNavLink]", never, {}, {}, never, ["[clrVerticalNavIcon]", "*"], false, never>;
}

import { OnDestroy, OnInit } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import * as i0 from "@angular/core";
export declare class ClrAriaCurrentLink implements OnInit, OnDestroy {
    private rla;
    ariaCurrent: string | undefined;
    private subscription;
    constructor(rla: RouterLinkActive);
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAriaCurrentLink, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrAriaCurrentLink, "[clrAriaCurrentLink]", never, {}, {}, never, never, false, never>;
}

import { ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ResponsiveNavigationService } from '../nav/providers/responsive-navigation.service';
import { ResponsiveNavControlMessage } from '../nav/responsive-nav-control-message';
import * as i0 from "@angular/core";
export declare class ClrMainContainer implements OnDestroy, OnInit {
    private elRef;
    private responsiveNavService;
    private _subscription;
    private _classList;
    constructor(elRef: ElementRef<HTMLElement>, responsiveNavService: ResponsiveNavigationService);
    ngOnInit(): void;
    processMessage(message: ResponsiveNavControlMessage): void;
    controlNav(controlCode: string, navClass: string): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrMainContainer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrMainContainer, "clr-main-container", never, {}, {}, never, never, false, never>;
}

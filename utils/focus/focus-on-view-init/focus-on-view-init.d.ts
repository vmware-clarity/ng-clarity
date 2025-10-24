import { AfterViewInit, ElementRef, NgZone, OnDestroy, Renderer2 } from '@angular/core';
import * as i0 from "@angular/core";
export declare class ClrFocusOnViewInit implements AfterViewInit, OnDestroy {
    private el;
    private platformId;
    private focusOnViewInit;
    private renderer;
    private document;
    private directFocus;
    private destroy$;
    private _isEnabled;
    constructor(el: ElementRef<HTMLElement>, platformId: any, focusOnViewInit: boolean, document: any, renderer: Renderer2, ngZone: NgZone);
    set isEnabled(value: boolean | string);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    private focus;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFocusOnViewInit, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrFocusOnViewInit, "[clrFocusOnViewInit]", never, { "isEnabled": "clrFocusOnViewInit"; }, {}, never, never, false, never>;
}

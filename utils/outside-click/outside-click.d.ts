import { ElementRef, EventEmitter, NgZone, OnDestroy, Renderer2 } from '@angular/core';
import * as i0 from "@angular/core";
export declare class OutsideClick implements OnDestroy {
    strict: boolean;
    outsideClick: EventEmitter<any>;
    private documentClickListener;
    constructor(host: ElementRef<HTMLElement>, renderer: Renderer2, ngZone: NgZone);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<OutsideClick, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<OutsideClick, "[clrOutsideClick]", never, { "strict": "clrStrict"; }, { "outsideClick": "clrOutsideClick"; }, never, never, false, never>;
}

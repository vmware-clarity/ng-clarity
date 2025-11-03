import { ElementRef, EventEmitter, NgZone, OnDestroy, Renderer2 } from '@angular/core';
export declare class OutsideClick implements OnDestroy {
    strict: boolean;
    outsideClick: EventEmitter<any>;
    private documentClickListener;
    constructor(host: ElementRef<HTMLElement>, renderer: Renderer2, ngZone: NgZone);
    ngOnDestroy(): void;
}

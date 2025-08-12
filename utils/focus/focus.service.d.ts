import { Optional, Renderer2 } from '@angular/core';
import { ArrowKeyDirection } from './arrow-key-direction.enum';
import { FocusableItem } from './focusable-item/focusable-item';
import * as i0 from "@angular/core";
export declare class FocusService {
    private renderer;
    private _current;
    private _unlistenFuncs;
    constructor(renderer: Renderer2);
    get current(): FocusableItem;
    reset(first: FocusableItem): void;
    listenToArrowKeys(el: HTMLElement): void;
    registerContainer(el: HTMLElement, tabIndex?: string): void;
    moveTo(item: FocusableItem): void;
    move(direction: ArrowKeyDirection): boolean;
    activateCurrent(): boolean;
    detachListeners(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FocusService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FocusService>;
}
export declare function clrFocusServiceFactory(existing: FocusService, renderer: Renderer2): FocusService;
export declare const FOCUS_SERVICE_PROVIDER: {
    provide: typeof FocusService;
    useFactory: typeof clrFocusServiceFactory;
    deps: (typeof Renderer2 | Optional[])[];
};

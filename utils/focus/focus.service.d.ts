import { Optional, Renderer2 } from '@angular/core';
import { ArrowKeyDirection } from './arrow-key-direction.enum';
import { FocusableItem } from './focusable-item/focusable-item';
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
}
export declare function clrFocusServiceFactory(existing: FocusService, renderer: Renderer2): FocusService;
export declare const FOCUS_SERVICE_PROVIDER: {
    provide: typeof FocusService;
    useFactory: typeof clrFocusServiceFactory;
    deps: (typeof Renderer2 | Optional[])[];
};

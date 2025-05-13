import { ElementRef, Renderer2 } from '@angular/core';
import { FocusableItem } from './focusable-item';
import * as i0 from "@angular/core";
export declare class BasicFocusableItem implements FocusableItem {
    private el;
    private renderer;
    private platformId;
    id: string;
    disabled: boolean;
    constructor(el: ElementRef<HTMLElement>, renderer: Renderer2, platformId: any);
    focus(): void;
    blur(): void;
    activate(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BasicFocusableItem, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BasicFocusableItem>;
}
export declare const BASIC_FOCUSABLE_ITEM_PROVIDER: {
    provide: typeof FocusableItem;
    useClass: typeof BasicFocusableItem;
}[];

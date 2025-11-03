import { ElementRef, Renderer2 } from '@angular/core';
import { FocusableItem } from './focusable-item';
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
}
export declare const BASIC_FOCUSABLE_ITEM_PROVIDER: {
    provide: typeof FocusableItem;
    useClass: typeof BasicFocusableItem;
}[];

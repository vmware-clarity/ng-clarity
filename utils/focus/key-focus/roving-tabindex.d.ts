import { ElementRef, Renderer2 } from '@angular/core';
import { FocusableItem } from './interfaces';
import { ClrKeyFocus } from './key-focus';
export declare class ClrRovingTabindex extends ClrKeyFocus {
    private renderer;
    private disabled;
    constructor(elementRef: ElementRef<HTMLElement>, renderer: Renderer2);
    get rovingIndexItems(): Array<FocusableItem> | string;
    set rovingIndexItems(elements: Array<FocusableItem> | string);
    set rovingTabindexDisabled(disabled: boolean);
    handleKeyboardEvent(event: KeyboardEvent): void;
    setClickedItemCurrent(event: any): void;
    protected initializeFocus(): void;
    private updateTabindex;
    private setTabindex;
}

import { ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class ClrKeyFocusItem {
    private elementRef;
    private platformId;
    constructor(elementRef: ElementRef<HTMLElement>, platformId: any);
    get nativeElement(): HTMLElement;
    focus(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrKeyFocusItem, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrKeyFocusItem, "[clrKeyFocusItem]", never, {}, {}, never, never, false, never>;
}

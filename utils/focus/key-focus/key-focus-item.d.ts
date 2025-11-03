import { ElementRef } from '@angular/core';
export declare class ClrKeyFocusItem {
    private elementRef;
    private platformId;
    constructor(elementRef: ElementRef<HTMLElement>, platformId: any);
    get nativeElement(): HTMLElement;
    focus(): void;
}

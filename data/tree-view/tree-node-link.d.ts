import { ElementRef } from '@angular/core';
export declare class ClrTreeNodeLink {
    private el;
    constructor(el: ElementRef<HTMLElement>);
    get active(): boolean;
    activate(): void;
}

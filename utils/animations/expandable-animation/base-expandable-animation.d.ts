import { ElementRef, Renderer2 } from '@angular/core';
import { DomAdapter } from '../../dom-adapter/dom-adapter';
export declare class BaseExpandableAnimation {
    protected element: ElementRef<HTMLElement>;
    protected domAdapter: DomAdapter;
    protected renderer: Renderer2;
    startHeight: number;
    constructor(element: ElementRef<HTMLElement>, domAdapter: DomAdapter, renderer: Renderer2);
    updateStartHeight(): void;
    initAnimationEffects(): void;
    cleanupAnimationEffects(cancelAnimations?: boolean): void;
    private cancelElementAnimations;
}

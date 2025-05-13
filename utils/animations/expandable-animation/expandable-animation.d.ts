import { AnimationEvent } from '@angular/animations';
import { ElementRef, Renderer2 } from '@angular/core';
import { DomAdapter } from '../../dom-adapter/dom-adapter';
import * as i0 from "@angular/core";
export declare class ClrExpandableAnimation {
    private element;
    private domAdapter;
    private renderer;
    clrExpandTrigger: boolean;
    startHeight: number;
    constructor(element: ElementRef<HTMLElement>, domAdapter: DomAdapter, renderer: Renderer2);
    get expandAnimation(): {
        value: boolean;
        params: {
            startHeight: number;
        };
    };
    animationStart(event: AnimationEvent): void;
    animationDone(event: AnimationEvent): void;
    updateStartHeight(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrExpandableAnimation, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrExpandableAnimation, "clr-expandable-animation", never, { "clrExpandTrigger": "clrExpandTrigger"; }, {}, never, ["*"], false, never>;
}

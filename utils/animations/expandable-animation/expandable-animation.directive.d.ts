import { AnimationBuilder } from '@angular/animations';
import { ElementRef, OnChanges, OnDestroy, Renderer2, SimpleChanges } from '@angular/core';
import { DomAdapter } from '../../dom-adapter/dom-adapter';
import { BaseExpandableAnimation } from './base-expandable-animation';
import * as i0 from "@angular/core";
export declare class ClrExpandableAnimationDirective extends BaseExpandableAnimation implements OnChanges, OnDestroy {
    private builder;
    expanded: boolean;
    private player;
    constructor(element: ElementRef<HTMLElement>, domAdapter: DomAdapter, renderer: Renderer2, builder: AnimationBuilder);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    playAnimation(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrExpandableAnimationDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrExpandableAnimationDirective, "[clrExpandableAnimation]", never, { "expanded": "clrExpandableAnimation"; }, {}, never, never, false, never>;
}

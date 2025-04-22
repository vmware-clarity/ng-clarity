import { ElementRef, Injector, Renderer2, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrRangeContainer } from './range-container';
import * as i0 from "@angular/core";
export declare class ClrRange extends WrappedFormControl<ClrRangeContainer> {
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRange, [null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrRange, "[clrRange]", never, {}, {}, never, never, false, never>;
}

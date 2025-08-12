import { ElementRef, Injector, Renderer2, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrSelectContainer } from './select-container';
import * as i0 from "@angular/core";
export declare class ClrSelect extends WrappedFormControl<ClrSelectContainer> {
    protected index: number;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLSelectElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSelect, [null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrSelect, "[clrSelect]", never, {}, {}, never, never, false, never>;
}

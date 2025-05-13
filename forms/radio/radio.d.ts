import { ElementRef, Injector, Renderer2, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrRadioWrapper } from '../radio/radio-wrapper';
import * as i0 from "@angular/core";
export declare class ClrRadio extends WrappedFormControl<ClrRadioWrapper> {
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRadio, [null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrRadio, "[clrRadio]", never, {}, {}, never, never, false, never>;
}

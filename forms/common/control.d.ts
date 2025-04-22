import { ElementRef, Injector, Renderer2, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ClrControlContainer } from './control-container';
import { WrappedFormControl } from './wrapped-control';
import * as i0 from "@angular/core";
export declare class ClrControl extends WrappedFormControl<ClrControlContainer> {
    protected index: number;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrControl, [null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrControl, "[clrControl]", never, {}, {}, never, never, false, never>;
}

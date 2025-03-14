import { ElementRef, Injector, Renderer2, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrTextareaContainer } from './textarea-container';
import * as i0 from "@angular/core";
export declare class ClrTextarea extends WrappedFormControl<ClrTextareaContainer> {
    protected index: number;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLTextAreaElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTextarea, [null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrTextarea, "[clrTextarea]", never, {}, {}, never, never, false, never>;
}

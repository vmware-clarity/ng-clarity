import { ElementRef, Injector, Renderer2, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FocusService } from '../common/providers/focus.service';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrNumberInputContainer } from './number-input-container';
import * as i0 from "@angular/core";
export declare class ClrNumberInput extends WrappedFormControl<ClrNumberInputContainer> {
    private focusService;
    private control;
    protected el: ElementRef<HTMLInputElement>;
    protected index: number;
    constructor(focusService: FocusService, vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>);
    get readonly(): boolean;
    triggerFocus(): void;
    triggerValidation(): void;
    stepUp(): void;
    stepDown(): void;
    dispatchBlur(): void;
    private dispatchStepChangeEvents;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrNumberInput, [{ optional: true; }, null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrNumberInput, "input[type=\"number\"][clrNumberInput]", never, {}, {}, never, never, false, never>;
}

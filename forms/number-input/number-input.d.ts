import { ElementRef, Injector, Renderer2, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ClrNumberInputContainer } from './number-input-container';
import { FocusService } from '../common/providers/focus.service';
import { WrappedFormControl } from '../common/wrapped-control';
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
}

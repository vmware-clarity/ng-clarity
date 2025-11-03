import { ElementRef, Injector, Renderer2, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ClrCheckboxWrapper } from './checkbox-wrapper';
import { WrappedFormControl } from '../common/wrapped-control';
/**
 * This implements both the clrCheckbox and clrToggle functionality, since they are both just checkboxes with different
 * visual styling. The challenge is that the container needs to know which selector was used, which the @Attribute
 * decorator gets for us to determine if the toggle is used, and emits a value to the wrapper container to tell it
 * there is a toggle switch instead.
 */
export declare class ClrCheckbox extends WrappedFormControl<ClrCheckboxWrapper> {
    private control;
    private toggle;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>, toggle: string);
    get controlDisabled(): boolean;
    ngOnInit(): void;
}

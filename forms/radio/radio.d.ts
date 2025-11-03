import { ElementRef, Injector, Renderer2, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrRadioWrapper } from '../radio/radio-wrapper';
export declare class ClrRadio extends WrappedFormControl<ClrRadioWrapper> {
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>);
}

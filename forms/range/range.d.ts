import { ElementRef, Injector, Renderer2, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ClrRangeContainer } from './range-container';
import { WrappedFormControl } from '../common/wrapped-control';
export declare class ClrRange extends WrappedFormControl<ClrRangeContainer> {
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>);
}

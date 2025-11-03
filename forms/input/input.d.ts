import { ElementRef, Injector, Renderer2, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ClrInputContainer } from './input-container';
import { WrappedFormControl } from '../common/wrapped-control';
export declare class ClrInput extends WrappedFormControl<ClrInputContainer> {
    protected index: number;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>);
}

import { ElementRef, Injector, Renderer2, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ClrSelectContainer } from './select-container';
import { WrappedFormControl } from '../common/wrapped-control';
export declare class ClrSelect extends WrappedFormControl<ClrSelectContainer> {
    protected index: number;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLSelectElement>);
}

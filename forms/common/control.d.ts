import { ElementRef, Injector, Renderer2, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ClrControlContainer } from './control-container';
import { WrappedFormControl } from './wrapped-control';
export declare class ClrControl extends WrappedFormControl<ClrControlContainer> {
    protected index: number;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLElement>);
}

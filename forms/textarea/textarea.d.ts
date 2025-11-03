import { ElementRef, Injector, Renderer2, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ClrTextareaContainer } from './textarea-container';
import { WrappedFormControl } from '../common/wrapped-control';
export declare class ClrTextarea extends WrappedFormControl<ClrTextareaContainer> {
    protected index: number;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLTextAreaElement>);
}

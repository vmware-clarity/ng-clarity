import { ElementRef, Injector, Renderer2, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ClrFileInputContainer } from './file-input-container';
import { ClrCommonStringsService } from '../../utils';
import { WrappedFormControl } from '../common/wrapped-control';
export interface ClrFileInputSelection {
    fileCount: number;
    buttonLabel: string;
    clearFilesButtonLabel: string;
}
export declare class ClrFileInput extends WrappedFormControl<ClrFileInputContainer> {
    readonly elementRef: ElementRef<HTMLInputElement>;
    private readonly control;
    private readonly commonStrings;
    selection: ClrFileInputSelection;
    constructor(injector: Injector, renderer: Renderer2, viewContainerRef: ViewContainerRef, elementRef: ElementRef<HTMLInputElement>, control: NgControl, commonStrings: ClrCommonStringsService);
    protected get disabled(): boolean;
    private handleChange;
    private updateSelection;
}

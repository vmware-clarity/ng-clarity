import { ElementRef } from '@angular/core';
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';
export declare class ClrFileInputValidator implements Validator {
    private readonly elementRef;
    minFileSize: number;
    maxFileSize: number;
    constructor(elementRef: ElementRef<HTMLInputElement>);
    validate(control: AbstractControl<FileList>): ValidationErrors;
    private getSuffixByDepth;
    private validateAccept;
}

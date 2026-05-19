import { ElementRef } from '@angular/core';
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import * as i0 from "@angular/core";
export declare class ClrFileInputValidator implements Validator {
    private readonly elementRef;
    minFileSize: number;
    maxFileSize: number;
    constructor(elementRef: ElementRef<HTMLInputElement>);
    validate(control: AbstractControl<FileList>): ValidationErrors;
    private getSuffixByDepth;
    private validateAccept;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileInputValidator, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrFileInputValidator, "input[type=\"file\"][clrFileInput]", never, { "minFileSize": "clrMinFileSize"; "maxFileSize": "clrMaxFileSize"; }, {}, never, never, false, never>;
}

import { ElementRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import * as i0 from "@angular/core";
export declare class ClrFileInputValueAccessor implements ControlValueAccessor {
    private readonly elementRef;
    constructor(elementRef: ElementRef<HTMLInputElement>);
    writeValue(value: FileList): void;
    registerOnChange(fn: (value: FileList) => void): void;
    registerOnTouched(fn: () => void): void;
    private handleChange;
    private onChange;
    private onTouched;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileInputValueAccessor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrFileInputValueAccessor, "input[type=\"file\"][clrFileInput]", never, {}, {}, never, never, false, never>;
}

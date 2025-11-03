import { ElementRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
export declare class ClrFileInputValueAccessor implements ControlValueAccessor {
    private readonly elementRef;
    constructor(elementRef: ElementRef<HTMLInputElement>);
    writeValue(value: FileList): void;
    registerOnChange(fn: (value: FileList) => void): void;
    registerOnTouched(fn: () => void): void;
    private handleChange;
    private onChange;
    private onTouched;
}

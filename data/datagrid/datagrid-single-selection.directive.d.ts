import { ElementRef, Renderer2 } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
export declare class ClrDatagridSingleSelectionValueAccessor implements ControlValueAccessor {
    private renderer;
    private elementRef;
    value: any;
    clrDgIdentityFn: (value: any) => unknown;
    private state;
    constructor(renderer: Renderer2, elementRef: ElementRef<HTMLInputElement>);
    onChange: (value: any) => void;
    onTouched: () => void;
    registerOnChange(fn: (value: any) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    writeValue(value: any): void;
    private keyOf;
    private updateChecked;
}

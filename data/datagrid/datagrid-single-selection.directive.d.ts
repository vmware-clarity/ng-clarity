import { ElementRef, Renderer2 } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import * as i0 from "@angular/core";
export declare class ClrDatagridSingleSelectionValueAccessor implements ControlValueAccessor {
    private renderer;
    private elementRef;
    value: any;
    clrDgItemsTrackBy: (value: any) => unknown;
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
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridSingleSelectionValueAccessor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDatagridSingleSelectionValueAccessor, "input[type=radio][clrDgSingleSelectionRadio]", never, { "value": "value"; "clrDgItemsTrackBy": "clrDgItemsTrackBy"; }, {}, never, never, false, never>;
}

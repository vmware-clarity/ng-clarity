import { ElementRef, Renderer2 } from '@angular/core';
import { DefaultValueAccessor } from '@angular/forms';
import * as i0 from "@angular/core";
export declare class ClrDatagridSingleSelectionValueAccessor extends DefaultValueAccessor {
    private renderer;
    private elementRef;
    value: any;
    clrDgItemsTrackBy: (value: any) => unknown;
    private model;
    constructor(renderer: Renderer2, elementRef: ElementRef<HTMLInputElement>);
    writeValue(value: any): void;
    private keyOf;
    private updateChecked;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridSingleSelectionValueAccessor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDatagridSingleSelectionValueAccessor, "input[type=radio][clrDgSingleSelectionRadio]", never, { "value": "value"; "clrDgItemsTrackBy": "clrDgItemsTrackBy"; }, {}, never, never, false, never>;
}

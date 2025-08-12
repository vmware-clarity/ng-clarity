import { ElementRef, OnInit } from '@angular/core';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ComboboxFocusHandler, OptionData as OptionProxy } from './providers/combobox-focus-handler.service';
import { OptionSelectionService } from './providers/option-selection.service';
import * as i0 from "@angular/core";
export declare class ClrOption<T> implements OnInit {
    elRef: ElementRef<HTMLElement>;
    commonStrings: ClrCommonStringsService;
    private focusHandler;
    private optionSelectionService;
    optionProxy: OptionProxy<T>;
    private _id;
    private _value;
    constructor(elRef: ElementRef<HTMLElement>, commonStrings: ClrCommonStringsService, focusHandler: ComboboxFocusHandler<T>, optionSelectionService: OptionSelectionService<T>);
    get optionId(): string;
    set optionId(id: string);
    get value(): T;
    set value(value: T);
    get selected(): boolean;
    get focusClass(): boolean;
    ngOnInit(): void;
    onClick(event: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrOption<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrOption<any>, "clr-option", never, { "optionId": "id"; "value": "clrValue"; }, {}, never, ["*"], false, never>;
}

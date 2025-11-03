import { ElementRef, OnInit } from '@angular/core';
import { ComboboxFocusHandler, OptionData as OptionProxy } from './providers/combobox-focus-handler.service';
import { OptionSelectionService } from './providers/option-selection.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
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
}

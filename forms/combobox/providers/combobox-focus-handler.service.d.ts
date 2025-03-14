import { ChangeDetectorRef, RendererFactory2 } from '@angular/core';
import { ClrPopoverToggleService } from '../../../utils/popover/providers/popover-toggle.service';
import { PseudoFocusModel } from '../model/pseudo-focus.model';
import { OptionSelectionService } from './option-selection.service';
import * as i0 from "@angular/core";
export declare class ComboboxFocusHandler<T> {
    private toggleService;
    private selectionService;
    private platformId;
    componentCdRef: ChangeDetectorRef;
    pseudoFocus: PseudoFocusModel<OptionData<T>>;
    private renderer;
    private _trigger;
    private _listbox;
    private _textInput;
    private optionData;
    constructor(rendererFactory: RendererFactory2, toggleService: ClrPopoverToggleService, selectionService: OptionSelectionService<T>, platformId: any);
    get trigger(): HTMLElement;
    set trigger(el: HTMLElement);
    get listbox(): HTMLElement;
    set listbox(el: HTMLElement);
    get textInput(): HTMLElement;
    set textInput(el: HTMLElement);
    focusInput(): void;
    focusFirstActive(): void;
    addOptionValues(options: OptionData<T>[]): void;
    private handleFocusSubscription;
    private moveFocusTo;
    private openAndMoveTo;
    private handleTextInput;
    private scrollIntoSelectedModel;
    private preventViewportScrolling;
    private addFocusOnBlurListener;
    private focusOutOfComponent;
    static ɵfac: i0.ɵɵFactoryDeclaration<ComboboxFocusHandler<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ComboboxFocusHandler<any>>;
}
export declare const COMBOBOX_FOCUS_HANDLER_PROVIDER: (import("@angular/core").Type<ComboboxFocusHandler<unknown>> | {
    provide: typeof import("../../../utils/focus/focusable-item/focusable-item").FocusableItem;
    useExisting: import("@angular/core").Type<ComboboxFocusHandler<unknown>>;
})[];
export declare class OptionData<T> {
    id: string;
    value: T;
    el: HTMLElement;
    constructor(id: string, value: T);
    equals(other: OptionData<T>): boolean;
}

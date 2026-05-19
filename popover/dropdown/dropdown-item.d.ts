import { ElementRef, Renderer2 } from '@angular/core';
import { FocusableItem } from '../../utils/focus/focusable-item/focusable-item';
import { ClrDropdown } from './dropdown';
import { RootDropdownService } from './providers/dropdown.service';
import * as i0 from "@angular/core";
export declare class ClrDropdownItem {
    private dropdown;
    private _dropdownService;
    private focusableItem;
    private el;
    private renderer;
    constructor(dropdown: ClrDropdown, _dropdownService: RootDropdownService, focusableItem: FocusableItem, el: ElementRef, renderer: Renderer2);
    get disabled(): boolean | string;
    set disabled(value: boolean | string);
    /**
     * Let you overwrite the focusable auto increment id.
     */
    get dropdownItemId(): string;
    set dropdownItemId(value: string);
    private onDropdownItemClick;
    private onSpaceKeydown;
    private onEnterKeydown;
    private stopImmediatePropagationIfDisabled;
    private findRootDropdown;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDropdownItem, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDropdownItem, "[clrDropdownItem]", never, { "disabled": "clrDisabled"; "dropdownItemId": "id"; }, {}, never, never, false, never>;
}

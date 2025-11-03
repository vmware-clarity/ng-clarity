import { ElementRef, Renderer2 } from '@angular/core';
import { ClrDropdown } from './dropdown';
import { RootDropdownService } from './providers/dropdown.service';
import { FocusableItem } from '../../utils/focus/focusable-item/focusable-item';
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
}

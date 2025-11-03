import { ElementRef, Renderer2 } from '@angular/core';
import { ClrDropdown } from './dropdown';
import { DropdownFocusHandler } from './providers/dropdown-focus-handler.service';
import { ClrPopoverToggleService } from '../../utils';
export declare class ClrDropdownTrigger {
    private toggleService;
    private el;
    private renderer;
    isRootLevelToggle: boolean;
    constructor(dropdown: ClrDropdown, toggleService: ClrPopoverToggleService, el: ElementRef<HTMLElement>, focusHandler: DropdownFocusHandler, renderer: Renderer2);
    get active(): boolean;
    onDropdownTriggerClick(event: any): void;
}

import { ElementRef, Renderer2 } from '@angular/core';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { ClrDropdown } from './dropdown';
import { DropdownFocusHandler } from './providers/dropdown-focus-handler.service';
import * as i0 from "@angular/core";
export declare class ClrDropdownTrigger {
    private toggleService;
    private el;
    private renderer;
    isRootLevelToggle: boolean;
    constructor(dropdown: ClrDropdown, toggleService: ClrPopoverToggleService, el: ElementRef<HTMLElement>, focusHandler: DropdownFocusHandler, renderer: Renderer2);
    get active(): boolean;
    onDropdownTriggerClick(event: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDropdownTrigger, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDropdownTrigger, "[clrDropdownTrigger],[clrDropdownToggle]", never, {}, {}, never, never, false, never>;
}

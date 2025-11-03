import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DropdownFocusHandler } from './providers/dropdown-focus-handler.service';
import { RootDropdownService } from './providers/dropdown.service';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
export declare class ClrDropdown implements OnDestroy {
    parent: ClrDropdown;
    toggleService: ClrPopoverToggleService;
    focusHandler: DropdownFocusHandler;
    isMenuClosable: boolean;
    private subscriptions;
    constructor(parent: ClrDropdown, toggleService: ClrPopoverToggleService, focusHandler: DropdownFocusHandler, cdr: ChangeDetectorRef, dropdownService: RootDropdownService);
    ngOnDestroy(): void;
}

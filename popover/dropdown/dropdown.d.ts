import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { DropdownFocusHandler } from './providers/dropdown-focus-handler.service';
import { RootDropdownService } from './providers/dropdown.service';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/popover/popover-host.directive";
export declare class ClrDropdown implements OnDestroy {
    parent: ClrDropdown;
    toggleService: ClrPopoverToggleService;
    focusHandler: DropdownFocusHandler;
    isMenuClosable: boolean;
    private subscriptions;
    constructor(parent: ClrDropdown, toggleService: ClrPopoverToggleService, focusHandler: DropdownFocusHandler, cdr: ChangeDetectorRef, dropdownService: RootDropdownService);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDropdown, [{ optional: true; skipSelf: true; }, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDropdown, "clr-dropdown", never, { "isMenuClosable": "clrCloseMenuOnItemClick"; }, {}, never, ["*"], false, [{ directive: typeof i1.ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

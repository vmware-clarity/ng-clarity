import { AfterContentInit, AfterViewInit, ElementRef, QueryList } from '@angular/core';
import { ClrDestroyService } from '../../utils/destroy/destroy.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrPopoverPosition } from '../../utils/popover/interfaces/popover-position.interface';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { ButtonGroupFocusHandler } from '../providers/button-group-focus-handler.service';
import { InitialFocus } from '../providers/button-group-focus.enum';
import { ButtonInGroupService } from '../providers/button-in-group.service';
import { ClrButton } from './button';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/popover/popover-host.directive";
export declare class ClrButtonGroup implements AfterContentInit, AfterViewInit {
    buttonGroupNewService: ButtonInGroupService;
    private toggleService;
    commonStrings: ClrCommonStringsService;
    private destroy$;
    private focusHandler;
    clrToggleButtonAriaLabel: string;
    menuToggle: ElementRef<HTMLElement>;
    menu: ElementRef<HTMLElement>;
    buttons: QueryList<ClrButton>;
    popoverId: string;
    InitialFocus: typeof InitialFocus;
    popoverPosition: ClrPopoverPosition;
    inlineButtons: ClrButton[];
    menuButtons: ClrButton[];
    private _menuPosition;
    constructor(buttonGroupNewService: ButtonInGroupService, toggleService: ClrPopoverToggleService, commonStrings: ClrCommonStringsService, destroy$: ClrDestroyService, focusHandler: ButtonGroupFocusHandler);
    get menuPosition(): string;
    set menuPosition(pos: string);
    get open(): boolean;
    /**
     * 1. Initializes the initial Button Group View
     * 2. Subscribes to changes on the ContentChildren
     *    in case the user content projection changes
     */
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    /**
     * Moves the button into the other ViewContainer
     * when an update is received.
     *
     * @param button
     */
    rearrangeButton(button: ClrButton): void;
    openMenu(event: Event, initialFocus: InitialFocus): void;
    /**
     * Author: Eudes
     *
     * Finds the order of a button w.r.t other buttons
     *
     * @param buttonToMove
     * @returns
     */
    getMoveIndex(buttonToMove: ClrButton): number;
    initializeButtons(): void;
    private handleFocusOnMenuOpen;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrButtonGroup, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrButtonGroup, "clr-button-group", never, { "clrToggleButtonAriaLabel": "clrToggleButtonAriaLabel"; "menuPosition": "clrMenuPosition"; }, {}, ["buttons"], never, false, [{ directive: typeof i1.ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

import { AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrPopoverPosition } from '../../utils/popover/interfaces/popover-position.interface';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { FocusService } from '../common/providers/focus.service';
import { LayoutService } from '../common/providers/layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { DateFormControlService } from './providers/date-form-control.service';
import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';
import { DatepickerEnabledService } from './providers/datepicker-enabled.service';
import { ViewManagerService } from './providers/view-manager.service';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/popover/popover-host.directive";
export declare class ClrDateContainer extends ClrAbstractContainer implements AfterViewInit {
    protected renderer: Renderer2;
    protected elem: ElementRef;
    private toggleService;
    private dateNavigationService;
    private datepickerEnabledService;
    private dateFormControlService;
    private dateIOService;
    commonStrings: ClrCommonStringsService;
    private viewManagerService;
    protected controlClassService: ControlClassService;
    protected layoutService: LayoutService;
    protected ngControlService: NgControlService;
    protected ifControlStateService: IfControlStateService;
    focus: boolean;
    private readonly clrDateInput;
    private readonly clrStartDateInput;
    private readonly clrEndDateInput;
    private toggleButton;
    constructor(renderer: Renderer2, elem: ElementRef, toggleService: ClrPopoverToggleService, dateNavigationService: DateNavigationService, datepickerEnabledService: DatepickerEnabledService, dateFormControlService: DateFormControlService, dateIOService: DateIOService, commonStrings: ClrCommonStringsService, focusService: FocusService, viewManagerService: ViewManagerService, controlClassService: ControlClassService, layoutService: LayoutService, ngControlService: NgControlService, ifControlStateService: IfControlStateService);
    /**
     * For date range picker actions buttons are shown by default
     */
    set showActionButtons(flag: boolean);
    set clrPosition(position: string);
    set rangeOptions(rangeOptions: any);
    set min(dateString: string);
    set max(dateString: string);
    set actionButton(button: ElementRef<HTMLButtonElement>);
    get popoverPosition(): ClrPopoverPosition;
    get open(): boolean;
    /**
     * Returns if the Datepicker is enabled or not. If disabled, hides the datepicker trigger.
     */
    get isEnabled(): boolean;
    /**
     * Return if Datepicker is diabled or not as Form Control
     */
    get isInputDateDisabled(): boolean;
    protected get isRangePicker(): boolean;
    ngAfterViewInit(): void;
    /**
     * Return the label for the toggle button.
     * If there's a selected date, the date is included in the label.
     */
    private getToggleButtonLabel;
    private listenForDateChanges;
    /**
     * Processes the user input and Initializes the Calendar everytime the datepicker popover is open.
     */
    private initializeCalendar;
    private dateRangeStructuralChecks;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDateContainer, [null, null, null, null, null, null, null, null, null, null, null, { optional: true; }, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDateContainer, "clr-date-container, clr-date-range-container", never, { "showActionButtons": "showActionButtons"; "clrPosition": "clrPosition"; "rangeOptions": "rangeOptions"; "min": "min"; "max": "max"; }, {}, ["clrDateInput", "clrStartDateInput", "clrEndDateInput"], ["label", "[clrStartDate]", "[clrEndDate]", "[clrDate]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, [{ directive: typeof i1.ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

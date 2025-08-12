/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChild, Input, Optional, ViewChild, } from '@angular/core';
import { startWith } from 'rxjs/operators';
import { ClrPopoverPositions } from '../../utils/popover/enums/positions.enum';
import { ClrPopoverHostDirective } from '../../utils/popover/popover-host.directive';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { FocusService } from '../common/providers/focus.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { ClrEndDateInput } from './date-end-input';
import { ClrDateInput } from './date-single-input';
import { ClrStartDateInput } from './date-start-input';
import { DateFormControlService } from './providers/date-form-control.service';
import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';
import { DatepickerEnabledService } from './providers/datepicker-enabled.service';
import { LocaleHelperService } from './providers/locale-helper.service';
import { ViewManagerService } from './providers/view-manager.service';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/popover/providers/popover-toggle.service";
import * as i2 from "./providers/date-navigation.service";
import * as i3 from "./providers/datepicker-enabled.service";
import * as i4 from "./providers/date-form-control.service";
import * as i5 from "./providers/date-io.service";
import * as i6 from "../../utils/i18n/common-strings.service";
import * as i7 from "../common/providers/focus.service";
import * as i8 from "./providers/view-manager.service";
import * as i9 from "../common/providers/control-class.service";
import * as i10 from "../common/providers/layout.service";
import * as i11 from "../common/providers/ng-control.service";
import * as i12 from "../common/if-control-state/if-control-state.service";
import * as i13 from "../../utils/popover/popover-host.directive";
import * as i14 from "@angular/common";
import * as i15 from "../../utils/cdk/cdk-trap-focus.module";
import * as i16 from "../../utils/popover/popover-anchor";
import * as i17 from "../../utils/popover/popover-open-close-button";
import * as i18 from "../../utils/popover/popover-content";
import * as i19 from "../../icon/icon";
import * as i20 from "../common/label";
import * as i21 from "./datepicker-view-manager";
export class ClrDateContainer extends ClrAbstractContainer {
    constructor(renderer, elem, toggleService, dateNavigationService, datepickerEnabledService, dateFormControlService, dateIOService, commonStrings, focusService, viewManagerService, controlClassService, layoutService, ngControlService, ifControlStateService) {
        super(ifControlStateService, layoutService, controlClassService, ngControlService);
        this.renderer = renderer;
        this.elem = elem;
        this.toggleService = toggleService;
        this.dateNavigationService = dateNavigationService;
        this.datepickerEnabledService = datepickerEnabledService;
        this.dateFormControlService = dateFormControlService;
        this.dateIOService = dateIOService;
        this.commonStrings = commonStrings;
        this.viewManagerService = viewManagerService;
        this.controlClassService = controlClassService;
        this.layoutService = layoutService;
        this.ngControlService = ngControlService;
        this.ifControlStateService = ifControlStateService;
        this.focus = false;
        this.subscriptions.push(focusService.focusChange.subscribe(state => {
            this.focus = state;
        }));
        this.subscriptions.push(toggleService.openChange.subscribe(() => {
            dateFormControlService.markAsTouched();
        }));
        if (dateNavigationService) {
            const tagName = elem.nativeElement.tagName.toLowerCase();
            dateNavigationService.hasActionButtons = dateNavigationService.isRangePicker =
                tagName === 'clr-date-range-container';
        }
    }
    /**
     * For date range picker actions buttons are shown by default
     */
    set showActionButtons(flag) {
        if (this.dateNavigationService.isRangePicker && !flag) {
            console.error('Error! The date range picker requires action buttons, [showActionButtons] cannot be turned off.');
        }
        else {
            this.dateNavigationService.hasActionButtons = flag;
        }
    }
    set clrPosition(position) {
        if (position && ClrPopoverPositions[position]) {
            this.viewManagerService.position = ClrPopoverPositions[position];
        }
    }
    set rangeOptions(rangeOptions) {
        this.dateIOService.setRangeOptions(rangeOptions);
    }
    set min(dateString) {
        if (this.dateNavigationService.isRangePicker) {
            this.dateIOService.setMinDate(dateString);
            this.clrStartDateInput?.triggerControlInputValidation();
            this.clrEndDateInput?.triggerControlInputValidation();
        }
        else {
            console.error('Error! The date container [min] input only works for date range pickers. Use the native `min` attribute/property for single-date inputs.');
        }
    }
    set max(dateString) {
        if (this.dateNavigationService.isRangePicker) {
            this.dateIOService.setMaxDate(dateString);
            this.clrStartDateInput?.triggerControlInputValidation();
            this.clrEndDateInput?.triggerControlInputValidation();
        }
        else {
            console.error('Error! The date container [max] input only works for date range pickers. Use the native `max` attribute/property for single-date inputs.');
        }
    }
    set actionButton(button) {
        this.toggleButton = button;
    }
    get popoverPosition() {
        return this.viewManagerService.position;
    }
    get open() {
        return this.toggleService.open;
    }
    /**
     * Returns if the Datepicker is enabled or not. If disabled, hides the datepicker trigger.
     */
    get isEnabled() {
        return this.datepickerEnabledService.isEnabled;
    }
    /**
     * Return if Datepicker is diabled or not as Form Control
     */
    get isInputDateDisabled() {
        /* clrForm wrapper or without clrForm */
        return ((this.control && this.control.disabled) || (this.dateFormControlService && this.dateFormControlService.disabled));
    }
    get isRangePicker() {
        return this.dateNavigationService.isRangePicker;
    }
    ngAfterViewInit() {
        this.dateRangeStructuralChecks();
        this.subscriptions.push(this.toggleService.openChange.subscribe(open => {
            if (open) {
                this.initializeCalendar();
            }
            else {
                this.toggleButton.nativeElement.focus();
                this.dateNavigationService.resetSelectedDay();
            }
        }));
        this.subscriptions.push(this.listenForDateChanges());
    }
    /**
     * Return the label for the toggle button.
     * If there's a selected date, the date is included in the label.
     */
    getToggleButtonLabel(day) {
        if (day) {
            const formattedDate = this.dateIOService.toLocaleDisplayFormatString(day.toDate());
            return this.commonStrings.parse(this.commonStrings.keys.datepickerToggleChangeDateLabel, {
                SELECTED_DATE: formattedDate,
            });
        }
        return this.commonStrings.keys.datepickerToggleChooseDateLabel;
    }
    listenForDateChanges() {
        // because date-input.ts initializes the input in ngAfterViewInit,
        // using a databound attribute to change the button labels results in ExpressionChangedAfterItHasBeenCheckedError.
        // so instead, update the attribute directly on the element
        return this.dateNavigationService.selectedDayChange
            .pipe(startWith(this.dateNavigationService.selectedDay))
            .subscribe(day => {
            if (this.isEnabled) {
                const label = this.getToggleButtonLabel(day);
                const toggleEl = this.toggleButton.nativeElement;
                this.renderer.setAttribute(toggleEl, 'aria-label', label);
                this.renderer.setAttribute(toggleEl, 'title', label);
            }
        });
    }
    /**
     * Processes the user input and Initializes the Calendar everytime the datepicker popover is open.
     */
    initializeCalendar() {
        this.dateNavigationService.initializeCalendar();
    }
    dateRangeStructuralChecks() {
        if (this.dateNavigationService.isRangePicker) {
            if (this.clrDateInput) {
                console.error('Error! clr-date-range-container must contain clrStartDate and clrEndDate inputs');
            }
            if (!this.clrStartDateInput) {
                console.error('Error! clr-date-range-container must contain clrStartDate input');
            }
            if (!this.clrEndDateInput) {
                console.error('Error! clr-date-range-container must contain clrEndDate input');
            }
        }
    }
}
ClrDateContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDateContainer, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i1.ClrPopoverToggleService }, { token: i2.DateNavigationService }, { token: i3.DatepickerEnabledService }, { token: i4.DateFormControlService }, { token: i5.DateIOService }, { token: i6.ClrCommonStringsService }, { token: i7.FocusService }, { token: i8.ViewManagerService }, { token: i9.ControlClassService }, { token: i10.LayoutService, optional: true }, { token: i11.NgControlService }, { token: i12.IfControlStateService }], target: i0.ɵɵFactoryTarget.Component });
ClrDateContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDateContainer, selector: "clr-date-container, clr-date-range-container", inputs: { showActionButtons: "showActionButtons", clrPosition: "clrPosition", rangeOptions: "rangeOptions", min: "min", max: "max" }, host: { properties: { "class.clr-date-container": "true", "class.clr-form-control-disabled": "isInputDateDisabled", "class.clr-form-control": "true", "class.clr-row": "addGrid()" } }, providers: [
        ControlIdService,
        LocaleHelperService,
        ControlClassService,
        FocusService,
        NgControlService,
        DateIOService,
        DateNavigationService,
        DatepickerEnabledService,
        DateFormControlService,
        ViewManagerService,
        IfControlStateService,
    ], queries: [{ propertyName: "clrDateInput", first: true, predicate: ClrDateInput, descendants: true }, { propertyName: "clrStartDateInput", first: true, predicate: ClrStartDateInput, descendants: true }, { propertyName: "clrEndDateInput", first: true, predicate: ClrEndDateInput, descendants: true }], viewQueries: [{ propertyName: "actionButton", first: true, predicate: ["actionButton"], descendants: true }], usesInheritance: true, hostDirectives: [{ directive: i13.ClrPopoverHostDirective }], ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper" clrPopoverAnchor>
        <div class="clr-input-group" [class.clr-focus]="focus">
          <!-- render range inputs only if using clr-date-range-container -->
          <ng-container *ngIf="isRangePicker">
            <ng-content select="[clrStartDate]"></ng-content>
            <span class="date-range-separator">-</span>
            <ng-content select="[clrEndDate]"></ng-content>
          </ng-container>
          <!-- no *ngIf for the singe-date input because it breaks the "auto-wrapped" date picker -->
          <ng-content select="[clrDate]"></ng-content>
          <button
            #actionButton
            type="button"
            clrPopoverOpenCloseButton
            class="clr-input-group-icon-action"
            [disabled]="isInputDateDisabled"
            *ngIf="isEnabled"
          >
            <cds-icon status="info" shape="calendar"></cds-icon>
          </button>
          <clr-datepicker-view-manager
            *clrPopoverContent="open; at: popoverPosition; outsideClickToClose: true; scrollToClose: true"
            cdkTrapFocus
          ></clr-datepicker-view-manager>
        </div>
        <cds-icon
          *ngIf="showInvalid"
          class="clr-validate-icon"
          shape="exclamation-circle"
          status="danger"
          aria-hidden="true"
        ></cds-icon>
        <cds-icon
          *ngIf="showValid"
          class="clr-validate-icon"
          shape="check-circle"
          status="success"
          aria-hidden="true"
        ></cds-icon>
      </div>
      <ng-content select="clr-control-helper" *ngIf="showHelper"></ng-content>
      <ng-content select="clr-control-error" *ngIf="showInvalid"></ng-content>
      <ng-content select="clr-control-success" *ngIf="showValid"></ng-content>
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i14.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i14.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i15.CdkTrapFocusModule_CdkTrapFocus, selector: "[cdkTrapFocus]" }, { kind: "directive", type: i16.ClrPopoverAnchor, selector: "[clrPopoverAnchor]" }, { kind: "directive", type: i17.ClrPopoverOpenCloseButton, selector: "[clrPopoverOpenCloseButton]", outputs: ["clrPopoverOpenCloseChange"] }, { kind: "directive", type: i18.ClrPopoverContent, selector: "[clrPopoverContent]", inputs: ["clrPopoverContent", "clrPopoverContentAt", "clrPopoverContentOutsideClickToClose", "clrPopoverContentScrollToClose"] }, { kind: "directive", type: i19.CdsIconCustomTag, selector: "cds-icon" }, { kind: "directive", type: i20.ClrLabel, selector: "label", inputs: ["id", "for"] }, { kind: "component", type: i21.ClrDatepickerViewManager, selector: "clr-datepicker-view-manager" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDateContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-date-container, clr-date-range-container',
                    template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper" clrPopoverAnchor>
        <div class="clr-input-group" [class.clr-focus]="focus">
          <!-- render range inputs only if using clr-date-range-container -->
          <ng-container *ngIf="isRangePicker">
            <ng-content select="[clrStartDate]"></ng-content>
            <span class="date-range-separator">-</span>
            <ng-content select="[clrEndDate]"></ng-content>
          </ng-container>
          <!-- no *ngIf for the singe-date input because it breaks the "auto-wrapped" date picker -->
          <ng-content select="[clrDate]"></ng-content>
          <button
            #actionButton
            type="button"
            clrPopoverOpenCloseButton
            class="clr-input-group-icon-action"
            [disabled]="isInputDateDisabled"
            *ngIf="isEnabled"
          >
            <cds-icon status="info" shape="calendar"></cds-icon>
          </button>
          <clr-datepicker-view-manager
            *clrPopoverContent="open; at: popoverPosition; outsideClickToClose: true; scrollToClose: true"
            cdkTrapFocus
          ></clr-datepicker-view-manager>
        </div>
        <cds-icon
          *ngIf="showInvalid"
          class="clr-validate-icon"
          shape="exclamation-circle"
          status="danger"
          aria-hidden="true"
        ></cds-icon>
        <cds-icon
          *ngIf="showValid"
          class="clr-validate-icon"
          shape="check-circle"
          status="success"
          aria-hidden="true"
        ></cds-icon>
      </div>
      <ng-content select="clr-control-helper" *ngIf="showHelper"></ng-content>
      <ng-content select="clr-control-error" *ngIf="showInvalid"></ng-content>
      <ng-content select="clr-control-success" *ngIf="showValid"></ng-content>
    </div>
  `,
                    providers: [
                        ControlIdService,
                        LocaleHelperService,
                        ControlClassService,
                        FocusService,
                        NgControlService,
                        DateIOService,
                        DateNavigationService,
                        DatepickerEnabledService,
                        DateFormControlService,
                        ViewManagerService,
                        IfControlStateService,
                    ],
                    hostDirectives: [ClrPopoverHostDirective],
                    host: {
                        '[class.clr-date-container]': 'true',
                        '[class.clr-form-control-disabled]': 'isInputDateDisabled',
                        '[class.clr-form-control]': 'true',
                        '[class.clr-row]': 'addGrid()',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i1.ClrPopoverToggleService }, { type: i2.DateNavigationService }, { type: i3.DatepickerEnabledService }, { type: i4.DateFormControlService }, { type: i5.DateIOService }, { type: i6.ClrCommonStringsService }, { type: i7.FocusService }, { type: i8.ViewManagerService }, { type: i9.ControlClassService }, { type: i10.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i11.NgControlService }, { type: i12.IfControlStateService }]; }, propDecorators: { clrDateInput: [{
                type: ContentChild,
                args: [ClrDateInput]
            }], clrStartDateInput: [{
                type: ContentChild,
                args: [ClrStartDateInput]
            }], clrEndDateInput: [{
                type: ContentChild,
                args: [ClrEndDateInput]
            }], showActionButtons: [{
                type: Input,
                args: ['showActionButtons']
            }], clrPosition: [{
                type: Input,
                args: ['clrPosition']
            }], rangeOptions: [{
                type: Input
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }], actionButton: [{
                type: ViewChild,
                args: ['actionButton']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1jb250YWluZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9kYXRlcGlja2VyL2RhdGUtY29udGFpbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUVMLFNBQVMsRUFDVCxZQUFZLEVBRVosS0FBSyxFQUNMLFFBQVEsRUFFUixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRzNDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBRS9FLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBRXJGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQzVGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQzFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUVqRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUMxRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDbkQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRXZELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQy9FLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM1RCxPQUFPLEVBQUUscUJBQXFC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QixpQkFBaUI7c0JBRHBCLEtBQUs7dUJBQUMsbUJBQW1CO2dCQVV0QixXQUFXO3NCQURkLEtBQUs7dUJBQUMsYUFBYTtnQkFRaEIsWUFBWTtzQkFEZixLQUFLO2dCQU1GLEdBQUc7c0JBRE4sS0FBSztnQkFjRixHQUFHO3NCQUROLEtBQUs7Z0JBY0YsWUFBWTtzQkFEZixTQUFTO3VCQUFDLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgT3B0aW9uYWwsXG4gIFJlbmRlcmVyMixcbiAgVmlld0NoaWxkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IHN0YXJ0V2l0aCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9pMThuL2NvbW1vbi1zdHJpbmdzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyUG9wb3ZlclBvc2l0aW9ucyB9IGZyb20gJy4uLy4uL3V0aWxzL3BvcG92ZXIvZW51bXMvcG9zaXRpb25zLmVudW0nO1xuaW1wb3J0IHsgQ2xyUG9wb3ZlclBvc2l0aW9uIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9pbnRlcmZhY2VzL3BvcG92ZXItcG9zaXRpb24uaW50ZXJmYWNlJztcbmltcG9ydCB7IENsclBvcG92ZXJIb3N0RGlyZWN0aXZlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9wb3BvdmVyLWhvc3QuZGlyZWN0aXZlJztcbmltcG9ydCB7IENsclBvcG92ZXJUb2dnbGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9wcm92aWRlcnMvcG9wb3Zlci10b2dnbGUuc2VydmljZSc7XG5pbXBvcnQgeyBDbHJBYnN0cmFjdENvbnRhaW5lciB9IGZyb20gJy4uL2NvbW1vbi9hYnN0cmFjdC1jb250YWluZXInO1xuaW1wb3J0IHsgSWZDb250cm9sU3RhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL2lmLWNvbnRyb2wtc3RhdGUvaWYtY29udHJvbC1zdGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbnRyb2xDbGFzc1NlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vcHJvdmlkZXJzL2NvbnRyb2wtY2xhc3Muc2VydmljZSc7XG5pbXBvcnQgeyBDb250cm9sSWRTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3Byb3ZpZGVycy9jb250cm9sLWlkLnNlcnZpY2UnO1xuaW1wb3J0IHsgRm9jdXNTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3Byb3ZpZGVycy9mb2N1cy5zZXJ2aWNlJztcbmltcG9ydCB7IExheW91dFNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vcHJvdmlkZXJzL2xheW91dC5zZXJ2aWNlJztcbmltcG9ydCB7IE5nQ29udHJvbFNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vcHJvdmlkZXJzL25nLWNvbnRyb2wuc2VydmljZSc7XG5pbXBvcnQgeyBDbHJFbmREYXRlSW5wdXQgfSBmcm9tICcuL2RhdGUtZW5kLWlucHV0JztcbmltcG9ydCB7IENsckRhdGVJbnB1dCB9IGZyb20gJy4vZGF0ZS1zaW5nbGUtaW5wdXQnO1xuaW1wb3J0IHsgQ2xyU3RhcnREYXRlSW5wdXQgfSBmcm9tICcuL2RhdGUtc3RhcnQtaW5wdXQnO1xuaW1wb3J0IHsgRGF5TW9kZWwgfSBmcm9tICcuL21vZGVsL2RheS5tb2RlbCc7XG5pbXBvcnQgeyBEYXRlRm9ybUNvbnRyb2xTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvZGF0ZS1mb3JtLWNvbnRyb2wuc2VydmljZSc7XG5pbXBvcnQgeyBEYXRlSU9TZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvZGF0ZS1pby5zZXJ2aWNlJztcbmltcG9ydCB7IERhdGVOYXZpZ2F0aW9uU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2RhdGUtbmF2aWdhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IERhdGVwaWNrZXJFbmFibGVkU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2RhdGVwaWNrZXItZW5hYmxlZC5zZXJ2aWNlJztcbmltcG9ydCB7IExvY2FsZUhlbHBlclNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9sb2NhbGUtaGVscGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgVmlld01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvdmlldy1tYW5hZ2VyLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZGF0ZS1jb250YWluZXIsIGNsci1kYXRlLXJhbmdlLWNvbnRhaW5lcicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwibGFiZWxcIj48L25nLWNvbnRlbnQ+XG4gICAgPGxhYmVsICpuZ0lmPVwiIWxhYmVsICYmIGFkZEdyaWQoKVwiPjwvbGFiZWw+XG4gICAgPGRpdiBjbGFzcz1cImNsci1jb250cm9sLWNvbnRhaW5lclwiIFtuZ0NsYXNzXT1cImNvbnRyb2xDbGFzcygpXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiY2xyLWlucHV0LXdyYXBwZXJcIiBjbHJQb3BvdmVyQW5jaG9yPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2xyLWlucHV0LWdyb3VwXCIgW2NsYXNzLmNsci1mb2N1c109XCJmb2N1c1wiPlxuICAgICAgICAgIDwhLS0gcmVuZGVyIHJhbmdlIGlucHV0cyBvbmx5IGlmIHVzaW5nIGNsci1kYXRlLXJhbmdlLWNvbnRhaW5lciAtLT5cbiAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiaXNSYW5nZVBpY2tlclwiPlxuICAgICAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiW2NsclN0YXJ0RGF0ZV1cIj48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImRhdGUtcmFuZ2Utc2VwYXJhdG9yXCI+LTwvc3Bhbj5cbiAgICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIltjbHJFbmREYXRlXVwiPjwvbmctY29udGVudD5cbiAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICA8IS0tIG5vICpuZ0lmIGZvciB0aGUgc2luZ2UtZGF0ZSBpbnB1dCBiZWNhdXNlIGl0IGJyZWFrcyB0aGUgXCJhdXRvLXdyYXBwZWRcIiBkYXRlIHBpY2tlciAtLT5cbiAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJbY2xyRGF0ZV1cIj48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgI2FjdGlvbkJ1dHRvblxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBjbHJQb3BvdmVyT3BlbkNsb3NlQnV0dG9uXG4gICAgICAgICAgICBjbGFzcz1cImNsci1pbnB1dC1ncm91cC1pY29uLWFjdGlvblwiXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwiaXNJbnB1dERhdGVEaXNhYmxlZFwiXG4gICAgICAgICAgICAqbmdJZj1cImlzRW5hYmxlZFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGNkcy1pY29uIHN0YXR1cz1cImluZm9cIiBzaGFwZT1cImNhbGVuZGFyXCI+PC9jZHMtaWNvbj5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8Y2xyLWRhdGVwaWNrZXItdmlldy1tYW5hZ2VyXG4gICAgICAgICAgICAqY2xyUG9wb3ZlckNvbnRlbnQ9XCJvcGVuOyBhdDogcG9wb3ZlclBvc2l0aW9uOyBvdXRzaWRlQ2xpY2tUb0Nsb3NlOiB0cnVlOyBzY3JvbGxUb0Nsb3NlOiB0cnVlXCJcbiAgICAgICAgICAgIGNka1RyYXBGb2N1c1xuICAgICAgICAgID48L2Nsci1kYXRlcGlja2VyLXZpZXctbWFuYWdlcj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxjZHMtaWNvblxuICAgICAgICAgICpuZ0lmPVwic2hvd0ludmFsaWRcIlxuICAgICAgICAgIGNsYXNzPVwiY2xyLXZhbGlkYXRlLWljb25cIlxuICAgICAgICAgIHNoYXBlPVwiZXhjbGFtYXRpb24tY2lyY2xlXCJcbiAgICAgICAgICBzdGF0dXM9XCJkYW5nZXJcIlxuICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgID48L2Nkcy1pY29uPlxuICAgICAgICA8Y2RzLWljb25cbiAgICAgICAgICAqbmdJZj1cInNob3dWYWxpZFwiXG4gICAgICAgICAgY2xhc3M9XCJjbHItdmFsaWRhdGUtaWNvblwiXG4gICAgICAgICAgc2hhcGU9XCJjaGVjay1jaXJjbGVcIlxuICAgICAgICAgIHN0YXR1cz1cInN1Y2Nlc3NcIlxuICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgID48L2Nkcy1pY29uPlxuICAgICAgPC9kaXY+XG4gICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItY29udHJvbC1oZWxwZXJcIiAqbmdJZj1cInNob3dIZWxwZXJcIj48L25nLWNvbnRlbnQ+XG4gICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItY29udHJvbC1lcnJvclwiICpuZ0lmPVwic2hvd0ludmFsaWRcIj48L25nLWNvbnRlbnQ+XG4gICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItY29udHJvbC1zdWNjZXNzXCIgKm5nSWY9XCJzaG93VmFsaWRcIj48L25nLWNvbnRlbnQ+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHByb3ZpZGVyczogW1xuICAgIENvbnRyb2xJZFNlcnZpY2UsXG4gICAgTG9jYWxlSGVscGVyU2VydmljZSxcbiAgICBDb250cm9sQ2xhc3NTZXJ2aWNlLFxuICAgIEZvY3VzU2VydmljZSxcbiAgICBOZ0NvbnRyb2xTZXJ2aWNlLFxuICAgIERhdGVJT1NlcnZpY2UsXG4gICAgRGF0ZU5hdmlnYXRpb25TZXJ2aWNlLFxuICAgIERhdGVwaWNrZXJFbmFibGVkU2VydmljZSxcbiAgICBEYXRlRm9ybUNvbnRyb2xTZXJ2aWNlLFxuICAgIFZpZXdNYW5hZ2VyU2VydmljZSxcbiAgICBJZkNvbnRyb2xTdGF0ZVNlcnZpY2UsXG4gIF0sXG4gIGhvc3REaXJlY3RpdmVzOiBbQ2xyUG9wb3Zlckhvc3REaXJlY3RpdmVdLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5jbHItZGF0ZS1jb250YWluZXJdJzogJ3RydWUnLFxuICAgICdbY2xhc3MuY2xyLWZvcm0tY29udHJvbC1kaXNhYmxlZF0nOiAnaXNJbnB1dERhdGVEaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5jbHItZm9ybS1jb250cm9sXSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLmNsci1yb3ddJzogJ2FkZEdyaWQoKScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsckRhdGVDb250YWluZXIgZXh0ZW5kcyBDbHJBYnN0cmFjdENvbnRhaW5lciBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuICBmb2N1cyA9IGZhbHNlO1xuXG4gIEBDb250ZW50Q2hpbGQoQ2xyRGF0ZUlucHV0KSBwcml2YXRlIHJlYWRvbmx5IGNsckRhdGVJbnB1dDogQ2xyRGF0ZUlucHV0O1xuICBAQ29udGVudENoaWxkKENsclN0YXJ0RGF0ZUlucHV0KSBwcml2YXRlIHJlYWRvbmx5IGNsclN0YXJ0RGF0ZUlucHV0OiBDbHJTdGFydERhdGVJbnB1dDtcbiAgQENvbnRlbnRDaGlsZChDbHJFbmREYXRlSW5wdXQpIHByaXZhdGUgcmVhZG9ubHkgY2xyRW5kRGF0ZUlucHV0OiBDbHJFbmREYXRlSW5wdXQ7XG5cbiAgcHJpdmF0ZSB0b2dnbGVCdXR0b246IEVsZW1lbnRSZWY8SFRNTEJ1dHRvbkVsZW1lbnQ+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByb3RlY3RlZCBlbGVtOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgdG9nZ2xlU2VydmljZTogQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBkYXRlTmF2aWdhdGlvblNlcnZpY2U6IERhdGVOYXZpZ2F0aW9uU2VydmljZSxcbiAgICBwcml2YXRlIGRhdGVwaWNrZXJFbmFibGVkU2VydmljZTogRGF0ZXBpY2tlckVuYWJsZWRTZXJ2aWNlLFxuICAgIHByaXZhdGUgZGF0ZUZvcm1Db250cm9sU2VydmljZTogRGF0ZUZvcm1Db250cm9sU2VydmljZSxcbiAgICBwcml2YXRlIGRhdGVJT1NlcnZpY2U6IERhdGVJT1NlcnZpY2UsXG4gICAgcHVibGljIGNvbW1vblN0cmluZ3M6IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlLFxuICAgIGZvY3VzU2VydmljZTogRm9jdXNTZXJ2aWNlLFxuICAgIHByaXZhdGUgdmlld01hbmFnZXJTZXJ2aWNlOiBWaWV3TWFuYWdlclNlcnZpY2UsXG4gICAgcHJvdGVjdGVkIG92ZXJyaWRlIGNvbnRyb2xDbGFzc1NlcnZpY2U6IENvbnRyb2xDbGFzc1NlcnZpY2UsXG4gICAgQE9wdGlvbmFsKCkgcHJvdGVjdGVkIG92ZXJyaWRlIGxheW91dFNlcnZpY2U6IExheW91dFNlcnZpY2UsXG4gICAgcHJvdGVjdGVkIG92ZXJyaWRlIG5nQ29udHJvbFNlcnZpY2U6IE5nQ29udHJvbFNlcnZpY2UsXG4gICAgcHJvdGVjdGVkIG92ZXJyaWRlIGlmQ29udHJvbFN0YXRlU2VydmljZTogSWZDb250cm9sU3RhdGVTZXJ2aWNlXG4gICkge1xuICAgIHN1cGVyKGlmQ29udHJvbFN0YXRlU2VydmljZSwgbGF5b3V0U2VydmljZSwgY29udHJvbENsYXNzU2VydmljZSwgbmdDb250cm9sU2VydmljZSk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIGZvY3VzU2VydmljZS5mb2N1c0NoYW5nZS5zdWJzY3JpYmUoc3RhdGUgPT4ge1xuICAgICAgICB0aGlzLmZvY3VzID0gc3RhdGU7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHRvZ2dsZVNlcnZpY2Uub3BlbkNoYW5nZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBkYXRlRm9ybUNvbnRyb2xTZXJ2aWNlLm1hcmtBc1RvdWNoZWQoKTtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIGlmIChkYXRlTmF2aWdhdGlvblNlcnZpY2UpIHtcbiAgICAgIGNvbnN0IHRhZ05hbWUgPSBlbGVtLm5hdGl2ZUVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLmhhc0FjdGlvbkJ1dHRvbnMgPSBkYXRlTmF2aWdhdGlvblNlcnZpY2UuaXNSYW5nZVBpY2tlciA9XG4gICAgICAgIHRhZ05hbWUgPT09ICdjbHItZGF0ZS1yYW5nZS1jb250YWluZXInO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGb3IgZGF0ZSByYW5nZSBwaWNrZXIgYWN0aW9ucyBidXR0b25zIGFyZSBzaG93biBieSBkZWZhdWx0XG4gICAqL1xuICBASW5wdXQoJ3Nob3dBY3Rpb25CdXR0b25zJylcbiAgc2V0IHNob3dBY3Rpb25CdXR0b25zKGZsYWc6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5kYXRlTmF2aWdhdGlvblNlcnZpY2UuaXNSYW5nZVBpY2tlciAmJiAhZmxhZykge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IhIFRoZSBkYXRlIHJhbmdlIHBpY2tlciByZXF1aXJlcyBhY3Rpb24gYnV0dG9ucywgW3Nob3dBY3Rpb25CdXR0b25zXSBjYW5ub3QgYmUgdHVybmVkIG9mZi4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kYXRlTmF2aWdhdGlvblNlcnZpY2UuaGFzQWN0aW9uQnV0dG9ucyA9IGZsYWc7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCdjbHJQb3NpdGlvbicpXG4gIHNldCBjbHJQb3NpdGlvbihwb3NpdGlvbjogc3RyaW5nKSB7XG4gICAgaWYgKHBvc2l0aW9uICYmIChDbHJQb3BvdmVyUG9zaXRpb25zIGFzIFJlY29yZDxzdHJpbmcsIGFueT4pW3Bvc2l0aW9uXSkge1xuICAgICAgdGhpcy52aWV3TWFuYWdlclNlcnZpY2UucG9zaXRpb24gPSAoQ2xyUG9wb3ZlclBvc2l0aW9ucyBhcyBSZWNvcmQ8c3RyaW5nLCBhbnk+KVtwb3NpdGlvbl07XG4gICAgfVxuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IHJhbmdlT3B0aW9ucyhyYW5nZU9wdGlvbnMpIHtcbiAgICB0aGlzLmRhdGVJT1NlcnZpY2Uuc2V0UmFuZ2VPcHRpb25zKHJhbmdlT3B0aW9ucyk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgbWluKGRhdGVTdHJpbmc6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmRhdGVOYXZpZ2F0aW9uU2VydmljZS5pc1JhbmdlUGlja2VyKSB7XG4gICAgICB0aGlzLmRhdGVJT1NlcnZpY2Uuc2V0TWluRGF0ZShkYXRlU3RyaW5nKTtcbiAgICAgIHRoaXMuY2xyU3RhcnREYXRlSW5wdXQ/LnRyaWdnZXJDb250cm9sSW5wdXRWYWxpZGF0aW9uKCk7XG4gICAgICB0aGlzLmNsckVuZERhdGVJbnB1dD8udHJpZ2dlckNvbnRyb2xJbnB1dFZhbGlkYXRpb24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgJ0Vycm9yISBUaGUgZGF0ZSBjb250YWluZXIgW21pbl0gaW5wdXQgb25seSB3b3JrcyBmb3IgZGF0ZSByYW5nZSBwaWNrZXJzLiBVc2UgdGhlIG5hdGl2ZSBgbWluYCBhdHRyaWJ1dGUvcHJvcGVydHkgZm9yIHNpbmdsZS1kYXRlIGlucHV0cy4nXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBtYXgoZGF0ZVN0cmluZzogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLmlzUmFuZ2VQaWNrZXIpIHtcbiAgICAgIHRoaXMuZGF0ZUlPU2VydmljZS5zZXRNYXhEYXRlKGRhdGVTdHJpbmcpO1xuICAgICAgdGhpcy5jbHJTdGFydERhdGVJbnB1dD8udHJpZ2dlckNvbnRyb2xJbnB1dFZhbGlkYXRpb24oKTtcbiAgICAgIHRoaXMuY2xyRW5kRGF0ZUlucHV0Py50cmlnZ2VyQ29udHJvbElucHV0VmFsaWRhdGlvbigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAnRXJyb3IhIFRoZSBkYXRlIGNvbnRhaW5lciBbbWF4XSBpbnB1dCBvbmx5IHdvcmtzIGZvciBkYXRlIHJhbmdlIHBpY2tlcnMuIFVzZSB0aGUgbmF0aXZlIGBtYXhgIGF0dHJpYnV0ZS9wcm9wZXJ0eSBmb3Igc2luZ2xlLWRhdGUgaW5wdXRzLidcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgQFZpZXdDaGlsZCgnYWN0aW9uQnV0dG9uJylcbiAgc2V0IGFjdGlvbkJ1dHRvbihidXR0b246IEVsZW1lbnRSZWY8SFRNTEJ1dHRvbkVsZW1lbnQ+KSB7XG4gICAgdGhpcy50b2dnbGVCdXR0b24gPSBidXR0b247XG4gIH1cblxuICBnZXQgcG9wb3ZlclBvc2l0aW9uKCk6IENsclBvcG92ZXJQb3NpdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMudmlld01hbmFnZXJTZXJ2aWNlLnBvc2l0aW9uO1xuICB9XG5cbiAgZ2V0IG9wZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMudG9nZ2xlU2VydmljZS5vcGVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgaWYgdGhlIERhdGVwaWNrZXIgaXMgZW5hYmxlZCBvciBub3QuIElmIGRpc2FibGVkLCBoaWRlcyB0aGUgZGF0ZXBpY2tlciB0cmlnZ2VyLlxuICAgKi9cbiAgZ2V0IGlzRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kYXRlcGlja2VyRW5hYmxlZFNlcnZpY2UuaXNFbmFibGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBpZiBEYXRlcGlja2VyIGlzIGRpYWJsZWQgb3Igbm90IGFzIEZvcm0gQ29udHJvbFxuICAgKi9cbiAgZ2V0IGlzSW5wdXREYXRlRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgLyogY2xyRm9ybSB3cmFwcGVyIG9yIHdpdGhvdXQgY2xyRm9ybSAqL1xuICAgIHJldHVybiAoXG4gICAgICAodGhpcy5jb250cm9sICYmIHRoaXMuY29udHJvbC5kaXNhYmxlZCkgfHwgKHRoaXMuZGF0ZUZvcm1Db250cm9sU2VydmljZSAmJiB0aGlzLmRhdGVGb3JtQ29udHJvbFNlcnZpY2UuZGlzYWJsZWQpXG4gICAgKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgaXNSYW5nZVBpY2tlcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kYXRlTmF2aWdhdGlvblNlcnZpY2UuaXNSYW5nZVBpY2tlcjtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmRhdGVSYW5nZVN0cnVjdHVyYWxDaGVja3MoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHRoaXMudG9nZ2xlU2VydmljZS5vcGVuQ2hhbmdlLnN1YnNjcmliZShvcGVuID0+IHtcbiAgICAgICAgaWYgKG9wZW4pIHtcbiAgICAgICAgICB0aGlzLmluaXRpYWxpemVDYWxlbmRhcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudG9nZ2xlQnV0dG9uLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICB0aGlzLmRhdGVOYXZpZ2F0aW9uU2VydmljZS5yZXNldFNlbGVjdGVkRGF5KCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKHRoaXMubGlzdGVuRm9yRGF0ZUNoYW5nZXMoKSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBsYWJlbCBmb3IgdGhlIHRvZ2dsZSBidXR0b24uXG4gICAqIElmIHRoZXJlJ3MgYSBzZWxlY3RlZCBkYXRlLCB0aGUgZGF0ZSBpcyBpbmNsdWRlZCBpbiB0aGUgbGFiZWwuXG4gICAqL1xuICBwcml2YXRlIGdldFRvZ2dsZUJ1dHRvbkxhYmVsKGRheTogRGF5TW9kZWwpOiBzdHJpbmcge1xuICAgIGlmIChkYXkpIHtcbiAgICAgIGNvbnN0IGZvcm1hdHRlZERhdGUgPSB0aGlzLmRhdGVJT1NlcnZpY2UudG9Mb2NhbGVEaXNwbGF5Rm9ybWF0U3RyaW5nKGRheS50b0RhdGUoKSk7XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbW1vblN0cmluZ3MucGFyc2UodGhpcy5jb21tb25TdHJpbmdzLmtleXMuZGF0ZXBpY2tlclRvZ2dsZUNoYW5nZURhdGVMYWJlbCwge1xuICAgICAgICBTRUxFQ1RFRF9EQVRFOiBmb3JtYXR0ZWREYXRlLFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy5kYXRlcGlja2VyVG9nZ2xlQ2hvb3NlRGF0ZUxhYmVsO1xuICB9XG5cbiAgcHJpdmF0ZSBsaXN0ZW5Gb3JEYXRlQ2hhbmdlcygpIHtcbiAgICAvLyBiZWNhdXNlIGRhdGUtaW5wdXQudHMgaW5pdGlhbGl6ZXMgdGhlIGlucHV0IGluIG5nQWZ0ZXJWaWV3SW5pdCxcbiAgICAvLyB1c2luZyBhIGRhdGFib3VuZCBhdHRyaWJ1dGUgdG8gY2hhbmdlIHRoZSBidXR0b24gbGFiZWxzIHJlc3VsdHMgaW4gRXhwcmVzc2lvbkNoYW5nZWRBZnRlckl0SGFzQmVlbkNoZWNrZWRFcnJvci5cbiAgICAvLyBzbyBpbnN0ZWFkLCB1cGRhdGUgdGhlIGF0dHJpYnV0ZSBkaXJlY3RseSBvbiB0aGUgZWxlbWVudFxuICAgIHJldHVybiB0aGlzLmRhdGVOYXZpZ2F0aW9uU2VydmljZS5zZWxlY3RlZERheUNoYW5nZVxuICAgICAgLnBpcGUoc3RhcnRXaXRoKHRoaXMuZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRGF5KSlcbiAgICAgIC5zdWJzY3JpYmUoZGF5ID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmFibGVkKSB7XG4gICAgICAgICAgY29uc3QgbGFiZWwgPSB0aGlzLmdldFRvZ2dsZUJ1dHRvbkxhYmVsKGRheSk7XG4gICAgICAgICAgY29uc3QgdG9nZ2xlRWwgPSB0aGlzLnRvZ2dsZUJ1dHRvbi5uYXRpdmVFbGVtZW50O1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRvZ2dsZUVsLCAnYXJpYS1sYWJlbCcsIGxhYmVsKTtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0b2dnbGVFbCwgJ3RpdGxlJywgbGFiZWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9jZXNzZXMgdGhlIHVzZXIgaW5wdXQgYW5kIEluaXRpYWxpemVzIHRoZSBDYWxlbmRhciBldmVyeXRpbWUgdGhlIGRhdGVwaWNrZXIgcG9wb3ZlciBpcyBvcGVuLlxuICAgKi9cbiAgcHJpdmF0ZSBpbml0aWFsaXplQ2FsZW5kYXIoKTogdm9pZCB7XG4gICAgdGhpcy5kYXRlTmF2aWdhdGlvblNlcnZpY2UuaW5pdGlhbGl6ZUNhbGVuZGFyKCk7XG4gIH1cblxuICBwcml2YXRlIGRhdGVSYW5nZVN0cnVjdHVyYWxDaGVja3MoKSB7XG4gICAgaWYgKHRoaXMuZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLmlzUmFuZ2VQaWNrZXIpIHtcbiAgICAgIGlmICh0aGlzLmNsckRhdGVJbnB1dCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciEgY2xyLWRhdGUtcmFuZ2UtY29udGFpbmVyIG11c3QgY29udGFpbiBjbHJTdGFydERhdGUgYW5kIGNsckVuZERhdGUgaW5wdXRzJyk7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuY2xyU3RhcnREYXRlSW5wdXQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IhIGNsci1kYXRlLXJhbmdlLWNvbnRhaW5lciBtdXN0IGNvbnRhaW4gY2xyU3RhcnREYXRlIGlucHV0Jyk7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuY2xyRW5kRGF0ZUlucHV0KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yISBjbHItZGF0ZS1yYW5nZS1jb250YWluZXIgbXVzdCBjb250YWluIGNsckVuZERhdGUgaW5wdXQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==
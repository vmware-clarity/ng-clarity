/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  Input,
  Optional,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { startWith } from 'rxjs/operators';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrPopoverPositions } from '../../utils/popover/enums/positions.enum';
import { ClrPopoverPosition } from '../../utils/popover/interfaces/popover-position.interface';
import { ClrPopoverHostDirective } from '../../utils/popover/popover-host.directive';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { FocusService } from '../common/providers/focus.service';
import { LayoutService } from '../common/providers/layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { ClrDateRangeEndInput } from './date-range-end-input';
import { ClrDateRangeStartInput } from './date-range-start-input';
import { DayModel } from './model/day.model';
import { DateFormControlService } from './providers/date-form-control.service';
import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';
import { DatepickerEnabledService } from './providers/datepicker-enabled.service';
import { DatePickerHelperService } from './providers/datepicker-helper.service';
import { LocaleHelperService } from './providers/locale-helper.service';
import { ViewManagerService } from './providers/view-manager.service';

@Component({
  selector: 'clr-date-container, clr-date-range-container',
  template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper" clrPopoverAnchor>
        <div class="clr-input-group" [class.clr-focus]="focus">
          <ng-content select="[clrDate]"></ng-content>
          <ng-content select="[clrRangeStartDate]"></ng-content>
          <ng-content select="[clrRangeEndDate]"></ng-content>
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
    DatePickerHelperService,
  ],
  hostDirectives: [ClrPopoverHostDirective],
  host: {
    '[class.clr-date-container]': 'true',
    '[class.clr-form-control-disabled]': 'isInputDateDisabled',
    '[class.clr-form-control]': 'true',
    '[class.clr-row]': 'addGrid()',
  },
})
export class ClrDateContainer extends ClrAbstractContainer implements AfterViewInit {
  focus = false;

  @ContentChild(ClrDateRangeStartInput) clrRangeStartEl: ClrDateRangeStartInput;
  @ContentChild(ClrDateRangeEndInput) clrRangeEndEl: ClrDateRangeEndInput;

  private _dateFormat: string;
  private toggleButton: ElementRef;

  constructor(
    protected renderer: Renderer2,
    elem: ElementRef,
    private toggleService: ClrPopoverToggleService,
    private dateNavigationService: DateNavigationService,
    private datepickerEnabledService: DatepickerEnabledService,
    private dateFormControlService: DateFormControlService,
    private dateIOService: DateIOService,
    public commonStrings: ClrCommonStringsService,
    private focusService: FocusService,
    private viewManagerService: ViewManagerService,
    protected override controlClassService: ControlClassService,
    @Optional() protected override layoutService: LayoutService,
    protected override ngControlService: NgControlService,
    protected override ifControlStateService: IfControlStateService
  ) {
    super(ifControlStateService, layoutService, controlClassService, ngControlService);

    this.subscriptions.push(
      this.focusService.focusChange.subscribe(state => {
        this.focus = state;
      })
    );

    this.subscriptions.push(
      this.toggleService.openChange.subscribe(() => {
        this.dateFormControlService.markAsTouched();
      })
    );

    if (this.dateNavigationService) {
      const tagName = elem.nativeElement.tagName.toLowerCase();
      this.dateNavigationService.isRangePicker = tagName === 'clr-date-range-container';
    }
  }

  @Input('clrPosition')
  set clrPosition(position: string) {
    if (position && (ClrPopoverPositions as Record<string, any>)[position]) {
      this.viewManagerService.position = (ClrPopoverPositions as Record<string, any>)[position];
    }
  }

  @Input('rangeOptions')
  set rangeOptions(rangeOptions) {
    this.dateIOService.setRangeOptions(rangeOptions);
  }

  @Input()
  set min(dateString: string) {
    this.dateIOService.setMinDate(dateString);
    if (this.clrRangeStartEl && this.clrRangeEndEl) {
      this.clrRangeStartEl.triggerControlInputValidation();
      this.clrRangeEndEl.triggerControlInputValidation();
    }
  }

  @Input()
  set max(dateString: string) {
    this.dateIOService.setMaxDate(dateString);
    if (this.clrRangeStartEl && this.clrRangeEndEl) {
      this.clrRangeStartEl.triggerControlInputValidation();
      this.clrRangeEndEl.triggerControlInputValidation();
    }
  }

  get dateFormat() {
    return this._dateFormat;
  }

  @Input()
  set dateFormat(dateFormat: string) {
    this._dateFormat = dateFormat;
    this.dateIOService.setDateFormat(dateFormat);
  }

  @ViewChild('actionButton')
  set actionButton(button: ElementRef) {
    this.toggleButton = button;
  }

  get popoverPosition(): ClrPopoverPosition {
    return this.viewManagerService.position;
  }

  get open() {
    return this.toggleService.open;
  }

  /**
   * Returns if the Datepicker is enabled or not. If disabled, hides the datepicker trigger.
   */
  get isEnabled(): boolean {
    return this.datepickerEnabledService.isEnabled;
  }

  /**
   * Return if Datepicker is diabled or not as Form Control
   */
  get isInputDateDisabled(): boolean {
    /* clrForm wrapper or without clrForm */
    return (
      (this.control && this.control.disabled) || (this.dateFormControlService && this.dateFormControlService.disabled)
    );
  }

  ngAfterViewInit(): void {
    this.dateRangeStucturalChecks();
    this.subscriptions.push(
      this.toggleService.openChange.subscribe(open => {
        if (open) {
          this.initializeCalendar();
        } else {
          if (this.dateNavigationService.isRangePicker) {
            this.dateNavigationService.validateDateRange();
          }
          this.toggleButton.nativeElement.focus();
        }
      })
    );

    this.subscriptions.push(this.listenForDateChanges());
  }

  /**
   * Return the label for the toggle button.
   * If there's a selected date, the date is included in the label.
   */
  private getToggleButtonLabel(day: DayModel): string {
    if (day) {
      const formattedDate = this.dateIOService.toLocaleDisplayFormatString(day.toDate());

      return this.commonStrings.parse(this.commonStrings.keys.datepickerToggleChangeDateLabel, {
        SELECTED_DATE: formattedDate,
      });
    }
    return this.commonStrings.keys.datepickerToggleChooseDateLabel;
  }

  private listenForDateChanges() {
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
  private initializeCalendar(): void {
    this.dateNavigationService.initializeCalendar();
  }

  private dateRangeStucturalChecks() {
    if (this.dateNavigationService.isRangePicker) {
      if (!this.clrRangeStartEl) {
        console.error('Error! clr-date-range-container must contain clrRangeStartDate input');
      }
      if (!this.clrRangeEndEl) {
        console.error('Error! clr-date-range-container must contain clrRangeEndDate input');
      }
    }
  }
}

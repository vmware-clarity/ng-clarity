/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Component, ElementRef, Input, Optional, Renderer2, ViewChild } from '@angular/core';
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
import { DayModel } from './model/day.model';
import { DateFormControlService } from './providers/date-form-control.service';
import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';
import { DatepickerEnabledService } from './providers/datepicker-enabled.service';
import { LocaleHelperService } from './providers/locale-helper.service';
import { ViewManagerService } from './providers/view-manager.service';

@Component({
  selector: 'clr-date-container, clr-date-range-container',
  template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
    <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper" clrPopoverAnchor>
        <div class="clr-input-group" [class.clr-focus]="focus">
          <!-- render range inputs only if using clr-date-range-container -->
          @if (isRangePicker) {
          <ng-content select="[clrStartDate]"></ng-content>
          <span class="date-range-separator">-</span>
          <ng-content select="[clrEndDate]"></ng-content>
          }
          <!-- no *ngIf for the singe-date input because it breaks the "auto-wrapped" date picker -->
          <ng-content select="[clrDate]"></ng-content>
          @if (isEnabled) {
          <button
            #actionButton
            type="button"
            clrPopoverOpenCloseButton
            class="clr-input-group-icon-action"
            [disabled]="isInputDateDisabled"
          >
            <cds-icon status="info" shape="calendar"></cds-icon>
          </button>
          }
          <clr-datepicker-view-manager
            *clrPopoverContent="open; at: popoverPosition; outsideClickToClose: true; scrollToClose: true"
            cdkTrapFocus
          ></clr-datepicker-view-manager>
        </div>
        @if (showInvalid) {
        <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger" aria-hidden="true"></cds-icon>
        } @if (showValid) {
        <cds-icon class="clr-validate-icon" shape="check-circle" status="success" aria-hidden="true"></cds-icon>
        }
      </div>
      @if (showHelper) {
      <ng-content select="clr-control-helper"></ng-content>
      } @if (showInvalid) {
      <ng-content select="clr-control-error"></ng-content>
      } @if (showValid) {
      <ng-content select="clr-control-success"></ng-content>
      }
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
  standalone: false,
})
export class ClrDateContainer extends ClrAbstractContainer implements AfterViewInit {
  focus = false;

  private toggleButton: ElementRef<HTMLButtonElement>;

  constructor(
    protected renderer: Renderer2,
    protected elem: ElementRef,
    private toggleService: ClrPopoverToggleService,
    private dateNavigationService: DateNavigationService,
    private datepickerEnabledService: DatepickerEnabledService,
    private dateFormControlService: DateFormControlService,
    private dateIOService: DateIOService,
    public commonStrings: ClrCommonStringsService,
    focusService: FocusService,
    private viewManagerService: ViewManagerService,
    protected override controlClassService: ControlClassService,
    @Optional() protected override layoutService: LayoutService,
    protected override ngControlService: NgControlService,
    protected override ifControlStateService: IfControlStateService
  ) {
    super(ifControlStateService, layoutService, controlClassService, ngControlService);

    this.subscriptions.push(
      focusService.focusChange.subscribe(state => {
        this.focus = state;
      })
    );

    this.subscriptions.push(
      toggleService.openChange.subscribe(() => {
        dateFormControlService.markAsTouched();
      })
    );

    if (dateNavigationService) {
      const tagName = elem.nativeElement.tagName.toLowerCase();
      dateNavigationService.hasActionButtons = dateNavigationService.isRangePicker =
        tagName === 'clr-date-range-container';
    }
  }

  /**
   * For date range picker actions buttons are shown by default
   */
  @Input('showActionButtons')
  set showActionButtons(flag: boolean) {
    if (this.dateNavigationService.isRangePicker && !flag) {
      console.error('Error! The date range picker requires action buttons, [showActionButtons] cannot be turned off.');
    } else {
      this.dateNavigationService.hasActionButtons = flag;
    }
  }

  @Input('clrPosition')
  set clrPosition(position: string) {
    if (position && (ClrPopoverPositions as Record<string, any>)[position]) {
      this.viewManagerService.position = (ClrPopoverPositions as Record<string, any>)[position];
    }
  }

  @Input()
  set rangeOptions(rangeOptions) {
    this.dateIOService.setRangeOptions(rangeOptions);
  }

  @Input()
  set min(dateString: string) {
    if (this.dateNavigationService.isRangePicker) {
      this.dateIOService.setMinDate(dateString);
    } else {
      console.error(
        'Error! The date container [min] input only works for date range pickers. Use the native `min` attribute/property for single-date inputs.'
      );
    }
  }

  @Input()
  set max(dateString: string) {
    if (this.dateNavigationService.isRangePicker) {
      this.dateIOService.setMaxDate(dateString);
    } else {
      console.error(
        'Error! The date container [max] input only works for date range pickers. Use the native `max` attribute/property for single-date inputs.'
      );
    }
  }

  @ViewChild('actionButton')
  set actionButton(button: ElementRef<HTMLButtonElement>) {
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

  protected get isRangePicker(): boolean {
    return this.dateNavigationService.isRangePicker;
  }

  ngAfterViewInit(): void {
    this.dateRangeStructuralChecks();
    this.subscriptions.push(
      this.toggleService.openChange.subscribe(open => {
        if (open) {
          this.initializeCalendar();
        } else {
          this.toggleButton.nativeElement.focus();
          this.dateNavigationService.resetSelectedDay();
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

  private dateRangeStructuralChecks() {
    if (this.dateNavigationService.isRangePicker) {
      const inputs: HTMLElement[] = Array.from(this.elem.nativeElement.querySelectorAll('input'));
      if (inputs.some(input => input.classList.contains('clr-date-input'))) {
        console.error('Error! clr-date-range-container must contain clrStartDate and clrEndDate inputs');
      }
      if (!inputs.some(input => input.classList.contains('clr-date-start-input'))) {
        console.error('Error! clr-date-range-container must contain clrStartDate input');
      }
      if (!inputs.some(input => input.classList.contains('clr-date-end-input'))) {
        console.error('Error! clr-date-range-container must contain clrEndDate input');
      }
    }
  }
}

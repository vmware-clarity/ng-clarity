/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrPopoverService } from '@clr/angular/popover/common';
import { createTestHelpers, TestContext } from '@clr/angular/testing';

import { ClrDay } from './day';
import { DayViewModel } from './model/day-view.model';
import { DayModel } from './model/day.model';
import { DateFormControlService } from './providers/date-form-control.service';
import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';
import { LocaleHelperService } from './providers/locale-helper.service';
import { ViewManagerService } from './providers/view-manager.service';

describe('Datepicker', () => {
  describe('Components', () => {
    describe('Day Component', () => {
      const helpers = createTestHelpers();

      let context: TestContext<ClrDay, TestComponent>;

      beforeEach(() => {
        context = helpers.create(ClrDay, TestComponent, [
          LocaleHelperService,
          DateNavigationService,
          ClrPopoverService,
          DateFormControlService,
          DateIOService,
          ViewManagerService,
        ]);
      });

      describe('View Basics', () => {
        it('renders the content based on the input provided', () => {
          expect(context.clarityElement.textContent.trim()).toMatch('1');

          context.testComponent.dayView = new DayViewModel(
            new DayModel(2018, 0, 25),
            false,
            false,
            false,
            false,
            false
          );
          context.detectChanges();

          expect(context.clarityElement.textContent.trim()).toMatch('25');
        });

        it('renders one button based on the input provided', () => {
          expect(context.clarityElement.children.length).toBe(1);
          expect(context.clarityElement.children[0].tagName).toBe('BUTTON');
        });

        it("adds the .is-today class to the button when the input provided is today's day view", () => {
          const button: HTMLButtonElement = context.clarityElement.children[0];
          expect(button.classList.contains('is-today')).toBe(false);
          context.testComponent.dayView.isTodaysDate = true;

          context.detectChanges();
          expect(button.classList.contains('is-today')).toBe(true);

          context.testComponent.dayView.isTodaysDate = false;

          context.detectChanges();
          expect(button.classList.contains('is-today')).toBe(false);
        });

        it('adds the .is-selected class to the button when the input day view is selected', () => {
          const button: HTMLButtonElement = context.clarityElement.children[0];
          expect(button.classList.contains('is-selected')).toBe(false);
          context.testComponent.dayView.isSelected = true;

          context.detectChanges();
          expect(button.classList.contains('is-selected')).toBe(true);

          context.testComponent.dayView.isSelected = false;

          context.detectChanges();
          expect(button.classList.contains('is-selected')).toBe(false);
        });

        it('adds the .is-excluded class to the button when the input day view is excluded', () => {
          const button: HTMLButtonElement = context.clarityElement.children[0];
          expect(button.classList.contains('is-excluded')).toBe(false);
          context.testComponent.dayView.isExcluded = true;

          context.detectChanges();
          expect(button.classList.contains('is-excluded')).toBe(true);

          context.testComponent.dayView.isExcluded = false;

          context.detectChanges();
          expect(button.classList.contains('is-excluded')).toBe(false);
        });

        it('adds the .is-disabled class to the button when the input day view is disabled', () => {
          const button: HTMLButtonElement = context.clarityElement.children[0];
          expect(button.classList.contains('is-disabled')).toBe(false);
          context.testComponent.dayView.isDisabled = true;

          context.detectChanges();
          expect(button.classList.contains('is-disabled')).toBe(true);

          context.testComponent.dayView.isDisabled = false;

          context.detectChanges();
          expect(button.classList.contains('is-disabled')).toBe(false);
        });

        it('sets the right tabindex if the day is focusable', () => {
          const button: HTMLButtonElement = context.clarityElement.children[0];
          expect(button.tabIndex).toBe(-1);

          context.testComponent.dayView.isFocusable = true;
          context.detectChanges();
          expect(button.tabIndex).toBe(0);

          context.testComponent.dayView.isFocusable = false;
          context.detectChanges();
          expect(button.tabIndex).toBe(-1);
        });

        it('updates the date when a button in the day component is clicked', () => {
          vi.spyOn(context.clarityDirective, 'selectDay').mockImplementation(() => undefined);
          const button: HTMLButtonElement = context.clarityElement.children[0];

          button.click();
          context.detectChanges();

          expect(context.clarityDirective.selectDay).toHaveBeenCalled();
        });

        it('sets arria-current on the button correctly', () => {
          const button: HTMLButtonElement = context.clarityElement.children[0];

          context.testComponent.dayView.isTodaysDate = true;

          context.detectChanges();
          expect(button.attributes['aria-current'].value).toBe('date');

          context.testComponent.dayView.isTodaysDate = false;

          context.detectChanges();
          expect(button.attributes['aria-current'].value).toBe('false');
        });

        it('sets the correct value for the aria-label attribute', () => {
          const dayBtn: HTMLButtonElement = context.clarityElement.children[0];
          const dvm: DayViewModel = context.clarityDirective.dayView;
          expect(dayBtn.attributes['aria-label'].value).toEqual(dvm.dayModel.toDateString());
        });

        it('sets the correct value for the aria-label attribute when the date is selected', () => {
          const dayBtn: HTMLButtonElement = context.clarityElement.children[0];
          const dvm: DayViewModel = context.clarityDirective.dayView;

          context.testComponent.dayView.isSelected = true;

          context.detectChanges();
          expect(dayBtn.attributes['aria-label'].value).toEqual(`${dvm.dayModel.toDateString()} - Selected`);
        });

        it('sets aria-selected when the date is selected', () => {
          const button: HTMLButtonElement = context.clarityElement.children[0];
          expect(button.attributes['aria-selected'].value).toBe('false');
          context.testComponent.dayView.isSelected = true;

          context.detectChanges();
          expect(button.attributes['aria-selected'].value).toBe('true');
        });

        it('updates the focusable date when a button is focused', () => {
          vi.spyOn(context.clarityDirective, 'onDayViewFocus').mockImplementation(() => undefined);
          const button: HTMLButtonElement = context.clarityElement.children[0];

          button.focus();
          context.detectChanges();

          expect(context.clarityDirective.onDayViewFocus).toHaveBeenCalled();
        });
      });

      describe('Template API', () => {
        it('supports an Input for DayViewModel', () => {
          expect(context.clarityDirective.dayView).not.toBeUndefined();

          expect(context.clarityDirective.dayView.dayModel.date).toBe(1);
          expect(context.clarityDirective.dayView.dayModel.month).toBe(0);
          expect(context.clarityDirective.dayView.dayModel.year).toBe(2018);
          expect(context.clarityDirective.dayView.isTodaysDate).toBe(false);
          expect(context.clarityDirective.dayView.isSelected).toBe(false);
          expect(context.clarityDirective.dayView.isExcluded).toBe(false);
          expect(context.clarityDirective.dayView.isFocusable).toBe(false);
        });
      });

      describe('Typescript API', () => {
        it('updates the selected day when a Date is selected', () => {
          const dateNavigationService: DateNavigationService = context.getClarityProvider(DateNavigationService);
          const testDayView: DayViewModel = new DayViewModel(new DayModel(2018, 0, 1), false, false, false, false);
          vi.spyOn(context.clarityDirective.onSelectDay, 'emit').mockImplementation(() => undefined);

          expect(dateNavigationService.selectedDay).toBeUndefined();

          context.clarityDirective.dayView = testDayView;
          context.clarityDirective.selectDay();
          context.detectChanges();
          expect(context.clarityDirective.onSelectDay.emit).toHaveBeenCalled();
        });

        it('closes the popover when a Date is selected', () => {
          const popoverService = context.getClarityProvider(ClrPopoverService);
          expect(popoverService.open).toBeFalsy();

          const testDayView: DayViewModel = new DayViewModel(new DayModel(2018, 0, 1), false, false, false, false);

          context.clarityDirective.dayView = testDayView;
          context.clarityDirective.selectDay();
          context.detectChanges();

          expect(popoverService.open).toBe(false);
        });

        it('updates the focusedDay when a day is focused', () => {
          const dateNavigationService: DateNavigationService = context.getClarityProvider(DateNavigationService);
          const testDayView: DayViewModel = new DayViewModel(new DayModel(2018, 0, 1), false, false, false, false);

          expect(dateNavigationService.focusedDay).toBeUndefined();

          context.clarityDirective.dayView = testDayView;
          context.clarityDirective.onDayViewFocus();
          context.detectChanges();

          expect(dateNavigationService.focusedDay).not.toBeUndefined();
          expect(dateNavigationService.focusedDay.date).toBe(testDayView.dayModel.date);
          expect(dateNavigationService.focusedDay.month).toBe(testDayView.dayModel.month);
          expect(dateNavigationService.focusedDay.year).toBe(testDayView.dayModel.year);
        });

        it('marks the date control as dirty when a date is selected', () => {
          vi.spyOn(context.clarityDirective.onSelectDay, 'emit').mockImplementation(() => undefined);

          context.clarityDirective.selectDay();
          expect(context.clarityDirective.onSelectDay.emit).toHaveBeenCalled();
        });
      });
    });
  });
});

@Component({
  template: `<clr-day [clrDayView]="dayView"></clr-day>`,
  standalone: false,
})
class TestComponent {
  isToday = false;
  isExcluded = false;
  isDisabled = false;
  isSelected = false;
  isFocusable = false;
  dayModel: DayModel = new DayModel(2018, 0, 1);

  dayView: DayViewModel = new DayViewModel(
    this.dayModel,
    this.isToday,
    this.isExcluded,
    this.isDisabled,
    this.isSelected,
    this.isFocusable
  );
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrPopoverToggleService } from '@clr/angular/src/popover/common';
import { Keys } from '@clr/angular/src/utils';
import { TestContext } from '@clr/angular/testing';

import { DayModel } from './model/day.model';
import { ClrMonthpicker } from './monthpicker';
import { DateFormControlService } from './providers/date-form-control.service';
import { DateNavigationService } from './providers/date-navigation.service';
import { DatepickerFocusService } from './providers/datepicker-focus.service';
import { LocaleHelperService } from './providers/locale-helper.service';
import { ViewManagerService } from './providers/view-manager.service';

export default function () {
  describe('Monthpicker Component', () => {
    let context: TestContext<ClrMonthpicker, TestComponent>;
    let localeHelperService: LocaleHelperService;
    let dateNavigationService: DateNavigationService;
    const selectedMonth = 1;

    function initializeCalendar(selectedDay: DayModel) {
      dateNavigationService = new DateNavigationService();
      // Setting a selected date so that the calendar is initialized to that month and year.
      dateNavigationService.selectedDay = selectedDay;
      dateNavigationService.initializeCalendar();
    }

    describe('View Basics', () => {
      beforeEach(function () {
        initializeCalendar(new DayModel(2015, selectedMonth, 1));

        context = this.create(ClrMonthpicker, TestComponent, [
          ViewManagerService,
          DatepickerFocusService,
          ClrPopoverToggleService,
          { provide: DateNavigationService, useValue: dateNavigationService },
          LocaleHelperService,
          DateFormControlService,
        ]);
        localeHelperService = context.getClarityProvider(LocaleHelperService);
      });

      it('renders the months correctly', () => {
        const months: ReadonlyArray<string> = localeHelperService.localeMonthsWide;
        const buttons: HTMLButtonElement[] = context.clarityElement.querySelectorAll('button.month');

        expect(buttons.length).toBe(months.length);

        let count = 0;
        for (const button of buttons) {
          expect(button.textContent.trim()).toMatch(months[count]);
          count++;
        }
      });

      it('changes month when a month is clicked', () => {
        spyOn(context.clarityDirective, 'changeMonth');

        const buttons: HTMLButtonElement[] = context.clarityElement.querySelectorAll('button.month');

        buttons[0].click();
        context.detectChanges();

        expect(context.clarityDirective.changeMonth).toHaveBeenCalled();
      });

      it('has the correct month selected', () => {
        const buttons: HTMLButtonElement[] = context.clarityElement.querySelectorAll('button.month');
        expect(buttons[selectedMonth].classList.contains('is-selected')).toBe(true);
      });

      it('initializes the tab indices correctly', () => {
        const buttons: HTMLButtonElement[] = context.clarityElement.querySelectorAll('button.month');
        let count = 0;
        for (const button of buttons) {
          if (count === selectedMonth) {
            expect(button.tabIndex).toBe(context.clarityDirective.getTabIndex(count));
          } else {
            expect(button.tabIndex).toBe(context.clarityDirective.getTabIndex(count));
          }
          count++;
        }
      });

      it('updates the tab indices correctly', async () => {
        const buttons: HTMLButtonElement[] = context.clarityElement.querySelectorAll('button.month');
        expect(buttons[1].tabIndex).toBe(0);

        context.clarityElement.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        context.detectChanges();

        expect(buttons[1].tabIndex).toBe(-1);
        expect(buttons[3].tabIndex).toBe(0);

        context.clarityElement.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        context.detectChanges();

        expect(buttons[3].tabIndex).toBe(-1);
        expect(buttons[1].tabIndex).toBe(0);

        context.clarityElement.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        context.detectChanges();

        expect(buttons[1].tabIndex).toBe(-1);
        expect(buttons[2].tabIndex).toBe(0);

        context.clarityElement.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        context.detectChanges();

        expect(buttons[2].tabIndex).toBe(-1);
        expect(buttons[1].tabIndex).toBe(0);
      });
    });

    describe('Typescript API', () => {
      beforeEach(function () {
        initializeCalendar(new DayModel(2015, selectedMonth, 1));

        context = this.create(ClrMonthpicker, TestComponent, [
          ViewManagerService,
          DatepickerFocusService,
          ClrPopoverToggleService,
          { provide: DateNavigationService, useValue: dateNavigationService },
          LocaleHelperService,
          DateFormControlService,
        ]);
        localeHelperService = context.getClarityProvider(LocaleHelperService);
      });

      it('has access to the month array', () => {
        const months: ReadonlyArray<string> = localeHelperService.localeMonthsWide;

        let count = 0;
        for (const month of localeHelperService.localeMonthsWide) {
          expect(month).toMatch(months[count]);
          count++;
        }
      });

      it('gets the current month name in wide format', () => {
        expect(context.clarityDirective.calendarMonthIndex).toBe(selectedMonth);
      });

      it('gets the correct tabindex', () => {
        for (let i = 0; i < context.clarityDirective.monthNames.length; i++) {
          if (i === selectedMonth) {
            expect(context.clarityDirective.getTabIndex(i)).toBe(0);
          } else {
            expect(context.clarityDirective.getTabIndex(i)).toBe(-1);
          }
        }
      });

      it('changes view to day picker when change month is called', () => {
        const viewManagerService: ViewManagerService = context.getClarityProvider(ViewManagerService);

        viewManagerService.changeToMonthView();
        expect(viewManagerService.isMonthView).toBe(true);

        context.clarityDirective.changeMonth(0);

        expect(viewManagerService.isMonthView).toBe(false);
        expect(viewManagerService.isDayView).toBe(true);
      });

      it('updates the month value in the date navigation service', () => {
        const dateNavService: DateNavigationService = context.getClarityProvider(DateNavigationService);

        expect(dateNavService.displayedCalendar.month).toBe(1);

        context.clarityDirective.changeMonth(4);

        expect(dateNavService.displayedCalendar.month).toBe(4);
      });
    });

    describe('Keyboard Navigation', () => {
      //  Monthpicker Layout
      //  Jan   |   Jul
      //  Feb   |   Aug
      //  Mar   |   Sept
      //  Apr   |   Oct
      //  May   |   Nov
      //  Jun   |   Dec

      function createMonthPicker(scope: any, selectedDay: DayModel) {
        initializeCalendar(selectedDay);

        context = scope.create(ClrMonthpicker, TestComponent, [
          ViewManagerService,
          DatepickerFocusService,
          ClrPopoverToggleService,
          { provide: DateNavigationService, useValue: dateNavigationService },
          LocaleHelperService,
          DateFormControlService,
        ]);
      }

      it('handles the up arrow', function () {
        createMonthPicker(this, new DayModel(2015, 11, 1));

        expect(context.clarityDirective.getTabIndex(11)).toBe(0, "Month 11 doesn't have tabindex 0");

        for (let i = 9; i >= 0; i = i - 2) {
          context.clarityDirective.onKeyDown(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
          expect(context.clarityDirective.getTabIndex(i)).toBe(0, 'Month ' + i + " doesn't have tabindex 0");
          expect(context.clarityDirective.getTabIndex(i + 1)).toBe(
            -1,
            'Month ' + (i + 1) + " doesn't have tabindex -1"
          );
        }

        // Boundary
        expect(context.clarityDirective.getTabIndex(1)).toBe(0, "Month 0 does't have tabindex 0");
        context.clarityDirective.onKeyDown(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(context.clarityDirective.getTabIndex(1)).toBe(0, "Month 0 does't have tabindex 0");
      });

      it('handles the down arrow', function () {
        createMonthPicker(this, new DayModel(2015, 0, 1));

        expect(context.clarityDirective.getTabIndex(0)).toBe(0, "Month 0 doesn't have tabindex 0");

        for (let i = 2; i <= 11; i = i + 2) {
          context.clarityDirective.onKeyDown(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
          expect(context.clarityDirective.getTabIndex(i)).toBe(0, 'Month ' + i + " doesn't have tabindex 0");
          expect(context.clarityDirective.getTabIndex(i - 1)).toBe(
            -1,
            'Month ' + (i - 1) + " doesn't have tabindex -1"
          );
        }

        // Boundary
        expect(context.clarityDirective.getTabIndex(10)).toBe(0, "Month 11 does't have tabindex 0");
        context.clarityDirective.onKeyDown(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(context.clarityDirective.getTabIndex(10)).toBe(0, "Month 11 does't have tabindex 0");
      });

      // IE doesn't handle KeyboardEvent constructor
      it('handles the right arrow', function () {
        createMonthPicker(this, new DayModel(2015, 0, 1));

        for (let i = 0; i < 12; i++) {
          expect(context.clarityDirective.getTabIndex(i)).toBe(0, 'Month ' + (i + 2) + "doesn't have tabindex 0");
          context.clarityDirective.onKeyDown(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
          // tests boundary
          if (i === 11) {
            context.clarityDirective.onKeyDown(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
            expect(context.clarityDirective.getTabIndex(i)).toBe(0, 'Month ' + i + "doesn't have tabindex -1");
          }
        }
      });

      it('handles the left arrow', function () {
        createMonthPicker(this, new DayModel(2015, 11, 1));

        for (let i = 11; i > -1; i--) {
          expect(context.clarityDirective.getTabIndex(i)).toBe(0, 'Month ' + i + "doesn't have tabindex 0");
          context.clarityDirective.onKeyDown(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));

          if (i === 0) {
            context.clarityDirective.onKeyDown(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
            expect(context.clarityDirective.getTabIndex(i)).toBe(0, 'Month ' + i + "doesn't have tabindex -1");
          }
        }
      });
    });
  });
}

@Component({
  template: `<clr-monthpicker></clr-monthpicker>`,
  standalone: false,
})
class TestComponent {}

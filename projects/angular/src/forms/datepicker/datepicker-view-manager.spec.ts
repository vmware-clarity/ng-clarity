/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { TestContext } from '../../data/datagrid/helpers.spec';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { ClrDatepickerViewManager } from './datepicker-view-manager';
import { DateFormControlService } from './providers/date-form-control.service';
import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';
import { DatepickerFocusService } from './providers/datepicker-focus.service';
import { LocaleHelperService } from './providers/locale-helper.service';
import { ViewManagerService } from './providers/view-manager.service';

export default function () {
  describe('Datepicker View Manager Component', () => {
    let context: TestContext<ClrDatepickerViewManager, TestComponent>;
    let viewManagerService: ViewManagerService;
    let dateNavigationService: DateNavigationService;
    let dateIOService: DateIOService;

    let hostElement;

    beforeEach(function () {
      context = this.create(ClrDatepickerViewManager, TestComponent, [
        ViewManagerService,
        DatepickerFocusService,
        ClrPopoverToggleService,
        DateNavigationService,
        LocaleHelperService,
        DateIOService,
        DateFormControlService,
      ]);
      viewManagerService = context.getClarityProvider(ViewManagerService);
      dateNavigationService = context.getClarityProvider(DateNavigationService);
      dateIOService = context.getClarityProvider(DateIOService);
    });

    it('shows the daypicker when dayView is set to true with range options', () => {
      dateNavigationService.isRangePicker = true;
      dateIOService.setRangeOptions([{ label: 'Today', value: [new Date(), new Date()] }]);
      context.fixture.detectChanges();
      hostElement = context.clarityElement.querySelector('.datepicker-view-manager');
      expect(context.clarityDirective.isDayView).toBe(true);
      expect(hostElement.children.length).toBe(1);
      expect(hostElement.children[0].tagName).toBe('CLR-DAYPICKER');
    });

    it('shows the daypicker when dayView is set to true', () => {
      expect(context.clarityDirective.isDayView).toBe(true);
      hostElement = context.clarityElement.querySelector('.datepicker-view-manager');
      expect(hostElement.children.length).toBe(1);
      expect(hostElement.children[0].tagName).toBe('CLR-DAYPICKER');
    });

    it('shows the monthpicker when monthView is set to true', () => {
      viewManagerService.changeToMonthView();
      context.detectChanges();

      expect(context.clarityDirective.isMonthView).toBe(true);
      hostElement = context.clarityElement.querySelector('.datepicker-view-manager');
      expect(hostElement.children.length).toBe(1);
      expect(hostElement.children[0].tagName).toBe('CLR-MONTHPICKER');
    });

    it('shows the yearpicker when monthView is set to true', () => {
      viewManagerService.changeToYearView();
      context.detectChanges();

      expect(context.clarityDirective.isYearView).toBe(true);
      hostElement = context.clarityElement.querySelector('.datepicker-view-manager');
      expect(hostElement.children.length).toBe(1);
      expect(hostElement.children[0].tagName).toBe('CLR-YEARPICKER');
    });

    it('has the .datepicker class added to the host', () => {
      expect(context.clarityElement.classList.contains('datepicker')).toBe(true);
    });
  });
}

@Component({
  template: `<clr-datepicker-view-manager></clr-datepicker-view-manager>`,
  standalone: false,
})
class TestComponent {
  constructor(dateNavigationService: DateNavigationService) {
    dateNavigationService.initializeCalendar();
  }
}

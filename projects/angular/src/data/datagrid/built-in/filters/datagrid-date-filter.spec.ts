/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Renderer2, ViewChild } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { DomAdapter } from '../../../../utils/dom-adapter/dom-adapter';
import { ClrPopoverEventsService } from '../../../../utils/popover/providers/popover-events.service';
import { ClrPopoverPositionService } from '../../../../utils/popover/providers/popover-position.service';
import { ClrPopoverToggleService } from '../../../../utils/popover/providers/popover-toggle.service';
import { TestContext } from '../../helpers.spec';
import { ClrDatagridDateFilterInterface } from '../../interfaces/date-filter.interface';
import { CustomFilter } from '../../providers/custom-filter';
import { FiltersProvider } from '../../providers/filters';
import { Page } from '../../providers/page';
import { StateDebouncer } from '../../providers/state-debouncer.provider';
import { DatagridDateFilter } from './datagrid-date-filter';
import { DatagridDateFilterImpl } from './datagrid-date-filter-impl';

class MockRenderer {
  listen() {
    // Do nothing
  }
}

const PROVIDERS = [
  FiltersProvider,
  DomAdapter,
  Page,
  StateDebouncer,
  ClrPopoverEventsService,
  ClrPopoverPositionService,
  ClrPopoverToggleService,
  {
    provide: Renderer2,
    useClass: MockRenderer,
  },
];
export default function (): void {
  describe('DatagridDateFilter accessibility', function () {
    let context: TestContext<DatagridDateFilter<string>, AccessibilityTest>;

    function openFilter() {
      context.clarityElement.querySelector('.datagrid-filter-toggle').click();
      context.detectChanges();
    }

    beforeEach(function () {
      context = this.create(DatagridDateFilter, AccessibilityTest, PROVIDERS);
    });

    afterEach(function () {
      const popoverContent = document.querySelectorAll('.clr-popover-content');
      popoverContent.forEach(content => document.body.removeChild(content));
      context.fixture.destroy();
    });

    it('should be able to change the min placeholder text', fakeAsync(function () {
      context.testComponent.filterValue = [null, new Date()];
      context.testComponent.clrFilterMinPlaceholder = 'min demo placeholder';

      openFilter();
      const inputMin: HTMLInputElement = document.querySelector('input[name=low]');
      expect(inputMin.getAttribute('placeholder')).toBe('min demo placeholder');
      expect(inputMin.getAttribute('aria-label')).toBe('min demo placeholder');
      tick();
    }));

    it('should be able to change the max placeholder text', fakeAsync(function () {
      context.testComponent.filterValue = [null, new Date()];
      context.testComponent.clrFilterMaxPlaceholder = 'max demo placeholder';

      openFilter();
      const inputMax: HTMLInputElement = document.querySelector('input[name=high]');
      expect(inputMax.getAttribute('placeholder')).toBe('max demo placeholder');
      expect(inputMax.getAttribute('aria-label')).toBe('max demo placeholder');
      tick();
    }));
  });

  describe('DatagridDateFilter component', function () {
    // Until we can properly type "this"
    let context: TestContext<DatagridDateFilter<Date>, FullTest>;
    let filter: TestFilter;
    let filtersInstance: FiltersProvider<Date>;

    function openFilter() {
      context.clarityElement.querySelector('.datagrid-filter-toggle').click();
      context.detectChanges();
    }

    beforeEach(function () {
      filter = new TestFilter();
      context = this.create(DatagridDateFilter, FullTest, PROVIDERS);
      filtersInstance = TestBed.get(FiltersProvider);
    });

    afterEach(function () {
      const popoverContent = document.querySelectorAll('.clr-popover-content');
      popoverContent.forEach(content => document.body.removeChild(content));
      context.fixture.destroy();
    });

    it('receives an input for the filter value', function () {
      context.testComponent.filterValue = [null, new Date()];
      context.detectChanges();
      expect(context.clarityDirective.filter.value).toEqual([null, new Date()]);
    });

    it('wires the RegisteredFilter correctly', function () {
      const test = new DatagridDateFilterImpl(new TestFilter());
      context.testComponent.filter = filter;
      context.detectChanges();
      expect(context.clarityDirective.filter.filterFn).toEqual(test.filterFn);
    });

    it('receives an input for the filter logic', function () {
      context.testComponent.filter = filter;
      context.detectChanges();
      expect(context.clarityDirective.filter.filterFn).toBe(filter);
    });

    it('registers a filter', function () {
      context.clarityDirective.value = [null, new Date()];
      expect(filtersInstance.getActiveFilters().length).toBe(1);
      expect(filtersInstance.getActiveFilters()[0]).toBe(context.clarityDirective.filter);
    });

    it('registers itself as a CustomFilter provider', function () {
      expect(context.testComponent.customFilter).toBe(context.clarityDirective);
    });

    it('displays date inputs when open', function () {
      expect(document.querySelector("input[type='date']")).toBeNull();
      openFilter();
      expect(document.querySelector("input[type='date']")).not.toBeNull();
    });

    it('focuses on the input when the filter opens', fakeAsync(function () {
      openFilter();
      const input: HTMLInputElement = document.querySelector("input[type='date']");
      spyOn(input, 'focus');
      expect(input.focus).not.toHaveBeenCalled();
      // The `requestAnimationFrame` is mocked through `setTimeout(fn, 16)`.
      tick(16);
      expect(input.focus).toHaveBeenCalled();
    }));

    it('offers two way binding on the filtered state', function () {
      context.testComponent.filterValue = [new Date(), new Date()];
      context.detectChanges();
      expect(context.clarityDirective.value).toEqual([new Date(), new Date()]);
      context.clarityDirective.value = [null, new Date()];
      context.detectChanges();
      expect(context.testComponent.filterValue).toEqual([null, new Date()]);
    });
  });
}

class TestFilter implements ClrDatagridDateFilterInterface<Date> {
  accepts(item: Date, low: Date, high: Date) {
    return (
      // Make sure the limits are set and not null before checking them
      low === null || item >= low || high === null || item <= high
    );
  }
}

@Component({
  template: ` <clr-dg-date-filter [clrDgDateFilter]="filter" [(clrFilterValue)]="filterValue"></clr-dg-date-filter> `,
})
class FullTest {
  @ViewChild(CustomFilter) customFilter: CustomFilter;

  filter: ClrDatagridDateFilterInterface<Date>;
  filterValue: [Date, Date];
}

@Component({
  template: `
    <clr-dg-date-filter
      [clrDgDateFilter]="filter"
      [(clrFilterValue)]="filterValue"
      [clrFilterMaxPlaceholder]="clrFilterMaxPlaceholder"
      [clrFilterMinPlaceholder]="clrFilterMinPlaceholder"
    ></clr-dg-date-filter>
  `,
})
class AccessibilityTest {
  @ViewChild(CustomFilter) customFilter: CustomFilter;

  filter: ClrDatagridDateFilterInterface<string>;
  filterValue: [Date, Date];
  clrFilterMaxPlaceholder: string;
  clrFilterMinPlaceholder: string;
}

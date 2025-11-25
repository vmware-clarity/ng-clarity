/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ClrPopoverEventsService,
  ClrPopoverPositionService,
  ClrPopoverToggleService,
} from '@clr/angular/src/popover/common';
import { DomAdapter } from '@clr/angular/src/utils';
import { animationFrameTick, delay } from '@clr/angular/testing';

import { DatagridNumericFilter } from './datagrid-numeric-filter';
import { DatagridNumericFilterImpl } from './datagrid-numeric-filter-impl';
import { TestContext } from '../../helpers.spec';
import { ClrDatagridNumericFilterInterface } from '../../interfaces/numeric-filter.interface';
import { CustomFilter } from '../../providers/custom-filter';
import { FiltersProvider } from '../../providers/filters';
import { Page } from '../../providers/page';
import { StateDebouncer } from '../../providers/state-debouncer.provider';

const PROVIDERS = [FiltersProvider, DomAdapter, Page, StateDebouncer, ClrPopoverToggleService];

export default function (): void {
  describe('DatagridNumericFilter accessibility', function () {
    let context: TestContext<DatagridNumericFilter<string>, AccessibilityTest>;

    function openFilter() {
      context.clarityElement.querySelector('.datagrid-filter-toggle').click();
      context.detectChanges();
    }

    beforeEach(function () {
      context = this.create(DatagridNumericFilter, AccessibilityTest, PROVIDERS);
    });

    afterEach(function () {
      const popoverContent = document.querySelectorAll('.clr-popover-content');
      popoverContent.forEach(content => document.body.removeChild(content));
      context.fixture.destroy();
    });

    it('should be able to change the min placeholder text', async function () {
      context.testComponent.filterValue = [null, 10];
      context.testComponent.clrFilterMinPlaceholder = 'min demo placeholder';

      openFilter();
      const inputMin: HTMLInputElement = document.querySelector('input[name=low]');
      expect(inputMin.getAttribute('placeholder')).toBe('min demo placeholder');
      expect(inputMin.getAttribute('aria-label')).toBe('min demo placeholder');
      await delay();
    });
    it('should be able to change the max placeholder text', async function () {
      context.testComponent.filterValue = [null, 10];
      context.testComponent.clrFilterMaxPlaceholder = 'max demo placeholder';

      openFilter();
      const inputMax: HTMLInputElement = document.querySelector('input[name=high]');
      expect(inputMax.getAttribute('placeholder')).toBe('max demo placeholder');
      expect(inputMax.getAttribute('aria-label')).toBe('max demo placeholder');
      await delay();
    });
  });

  describe('DatagridNumericFilter component', function () {
    // Until we can properly type "this"
    let context: TestContext<DatagridNumericFilter<number>, FullTest>;
    let filter: TestFilter;
    let filtersInstance: FiltersProvider<number>;

    function openFilter() {
      context.clarityElement.querySelector('.datagrid-filter-toggle').click();
      context.detectChanges();
    }

    beforeEach(function () {
      filter = new TestFilter();
      context = this.create(DatagridNumericFilter, FullTest, PROVIDERS);
      filtersInstance = TestBed.inject(FiltersProvider);
    });

    afterEach(function () {
      const popoverContent = document.querySelectorAll('.clr-popover-content');
      popoverContent.forEach(content => document.body.removeChild(content));
      context.fixture.destroy();
    });

    it('receives an input for the filter value', function () {
      context.testComponent.filterValue = [null, 10];
      context.detectChanges();
      expect(context.clarityDirective.filter.value).toEqual([null, 10]);
    });

    it('wires the RegisteredFilter correctly', function () {
      const test = new DatagridNumericFilterImpl(new TestFilter());
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
      context.clarityDirective.value = [null, 10];
      expect(filtersInstance.getActiveFilters().length).toBe(1);
      expect(filtersInstance.getActiveFilters()[0]).toBe(context.clarityDirective.filter);
    });

    it('registers itself as a CustomFilter provider', function () {
      expect(context.testComponent.customFilter).toBe(context.clarityDirective);
    });

    it('displays numeric inputs when open', function () {
      expect(document.querySelector("input[type='number']")).toBeNull();
      openFilter();
      expect(document.querySelector("input[type='number']")).not.toBeNull();
    });

    it('focuses on the input when the filter opens', async function () {
      openFilter();
      const input: HTMLInputElement = document.querySelector("input[type='number']");
      spyOn(input, 'focus').and.callThrough();
      expect(input.focus).not.toHaveBeenCalled();
      await animationFrameTick();
      expect(input.focus).toHaveBeenCalled();
    });
    it('offers two way binding on the filtered state', function () {
      context.testComponent.filterValue = [1, 10];
      context.detectChanges();
      expect(context.clarityDirective.value).toEqual([1, 10]);
      context.clarityDirective.value = [null, 10];
      context.detectChanges();
      expect(context.testComponent.filterValue).toEqual([null, 10]);
    });
  });
}

class TestFilter implements ClrDatagridNumericFilterInterface<number> {
  accepts(item: number, low: number, high: number) {
    return (
      // Make sure the limits are set and not null before checking them
      low === null || item >= low || high === null || item <= high
    );
  }
}

@Component({
  template: `
    <clr-dg-numeric-filter [clrDgNumericFilter]="filter" [(clrFilterValue)]="filterValue"></clr-dg-numeric-filter>
  `,
  providers: [ClrPopoverEventsService, ClrPopoverPositionService],
  standalone: false,
})
class FullTest {
  @ViewChild(CustomFilter) customFilter: CustomFilter;

  filter: ClrDatagridNumericFilterInterface<number>;
  filterValue: [number, number];
}

@Component({
  template: `
    <clr-dg-numeric-filter
      [clrDgNumericFilter]="filter"
      [(clrFilterValue)]="filterValue"
      [clrFilterMaxPlaceholder]="clrFilterMaxPlaceholder"
      [clrFilterMinPlaceholder]="clrFilterMinPlaceholder"
    ></clr-dg-numeric-filter>
  `,
  providers: [ClrPopoverEventsService, ClrPopoverPositionService],
  standalone: false,
})
class AccessibilityTest {
  @ViewChild(CustomFilter) customFilter: CustomFilter;

  filter: ClrDatagridNumericFilterInterface<string>;
  filterValue: [number, number];
  clrFilterMaxPlaceholder: string;
  clrFilterMinPlaceholder: string;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ClrPopoverService } from '@clr/angular/popover/common';
import { animationFrameTick, createTestHelpers, delay, TestContext } from '@clr/angular/testing';
import { DomAdapter } from '@clr/angular/utils';

import { DatagridStringFilter } from './datagrid-string-filter';
import { DatagridStringFilterImpl } from './datagrid-string-filter-impl';
import { ClrDatagridStringFilterInterface } from '../../interfaces/string-filter.interface';
import { CustomFilter } from '../../providers/custom-filter';
import { FiltersProvider } from '../../providers/filters';
import { Page } from '../../providers/page';
import { StateDebouncer } from '../../providers/state-debouncer.provider';

const PROVIDERS = [FiltersProvider, DomAdapter, Page, StateDebouncer, ClrPopoverService];

export default function (): void {
  describe('DatagridStringFilter accessibility', () => {
    const helpers = createTestHelpers();

    let context: TestContext<DatagridStringFilter<string>, AccessibilityTest>;

    function openFilter() {
      context.clarityElement.querySelector('.datagrid-filter-toggle').click();
      context.detectChanges();
    }

    beforeEach(() => {
      context = helpers.create(DatagridStringFilter, AccessibilityTest, PROVIDERS);
    });

    it('should be able to change the placeholder text', async () => {
      context.testComponent.filterValue = 'M';
      context.testComponent.clrFilterPlaceholder = 'demo placeholder';

      openFilter();
      const input: HTMLInputElement = document.querySelector("input[type='text']");
      expect(input.getAttribute('placeholder')).toBe('demo placeholder');
      expect(input.getAttribute('aria-label')).toBe('demo placeholder');
      await delay();
    });
  });

  describe('DatagridStringFilter component', () => {
    const helpers = createTestHelpers();

    let context: TestContext<DatagridStringFilter<string>, FullTest>;
    let filter: TestFilter;
    let filtersInstance: FiltersProvider<string>;

    function openFilter() {
      context.clarityElement.querySelector('.datagrid-filter-toggle').click();
      context.detectChanges();
    }

    beforeEach(() => {
      filter = new TestFilter();
      context = helpers.create(DatagridStringFilter, FullTest, PROVIDERS);
      filtersInstance = TestBed.inject(FiltersProvider);
    });

    afterEach(() => {
      context.fixture.destroy();
    });

    it('receives an input for the filter value', () => {
      context.testComponent.filterValue = 'M';
      context.detectChanges();
      expect(context.clarityDirective.filter.value).toBe('M');
    });

    it('wires the RegisteredFilter correctly', () => {
      const test = new DatagridStringFilterImpl(new TestFilter());
      context.testComponent.filter = filter;
      context.detectChanges();
      expect(context.clarityDirective.filter.filterFn).toEqual(test.filterFn);
    });

    it('receives an input for the filter logic', () => {
      context.testComponent.filter = filter;
      context.detectChanges();
      expect(context.clarityDirective.filter.filterFn).toBe(filter);
    });

    it('registers a filter', () => {
      context.clarityDirective.value = 'test';
      expect(filtersInstance.getActiveFilters().length).toBe(1);
      expect(filtersInstance.getActiveFilters()[0]).toBe(context.clarityDirective.filter);
    });

    it('registers itself as a CustomFilter provider', () => {
      expect(context.testComponent.customFilter).toBe(context.clarityDirective);
    });

    it('displays a text input when open', () => {
      expect(document.querySelector("input[type='text']")).toBeNull();
      openFilter();
      expect(document.querySelector("input[type='text']")).not.toBeNull();
    });

    it('focuses on the input when the filter opens', async () => {
      openFilter();
      const input: HTMLInputElement = document.querySelector("input[type='text']");
      spyOn(input, 'focus');
      expect(input.focus).not.toHaveBeenCalled();
      await animationFrameTick();
      expect(input.focus).toHaveBeenCalled();
    });

    it('offers two way binding on the filtered state', () => {
      context.testComponent.filterValue = 'M';
      context.detectChanges();
      expect(context.clarityDirective.value).toBe('M');
      context.clarityDirective.value = 't';
      context.detectChanges();
      expect(context.testComponent.filterValue).toBe('t');
    });

    it('has an aria-label on the input', async () => {
      openFilter();
      const input: HTMLInputElement = document.querySelector("input[type='text']");
      expect(input.getAttribute('aria-label')).toBe('Filter items');
      await delay();
    });

    it('has placeholder on the input', async () => {
      openFilter();
      const input: HTMLInputElement = document.querySelector("input[type='text']");
      expect(input.getAttribute('placeholder')).toBe('Filter items');
      await delay();
    });
  });
}

class TestFilter implements ClrDatagridStringFilterInterface<string> {
  accepts(item: string, search: string) {
    return item.toLowerCase() === search;
  }
}

@Component({
  template: `
    <clr-dg-string-filter [clrDgStringFilter]="filter" [(clrFilterValue)]="filterValue"></clr-dg-string-filter>
  `,
  standalone: false,
})
class FullTest {
  @ViewChild(CustomFilter) customFilter: CustomFilter;

  filter: ClrDatagridStringFilterInterface<string>;
  filterValue: string;
}

@Component({
  template: `
    <clr-dg-string-filter
      [clrDgStringFilter]="filter"
      [(clrFilterValue)]="filterValue"
      [clrFilterPlaceholder]="clrFilterPlaceholder"
    ></clr-dg-string-filter>
  `,
  standalone: false,
})
class AccessibilityTest {
  @ViewChild(CustomFilter) customFilter: CustomFilter;

  filter: ClrDatagridStringFilterInterface<string>;
  filterValue: string;
  clrFilterPlaceholder: string;
}

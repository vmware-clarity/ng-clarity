/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createTestHelpers, TestContext } from '@clr/angular/testing';
import { Subject } from 'rxjs';

import { DatagridPropertyComparator } from './built-in/comparators/datagrid-property-comparator';
import { DatagridNumericFilterImpl } from './built-in/filters/datagrid-numeric-filter-impl';
import { DatagridStringFilter } from './built-in/filters/datagrid-string-filter';
import { DatagridStringFilterImpl } from './built-in/filters/datagrid-string-filter-impl';
import { ClrDatagridColumn } from './datagrid-column';
import { ClrDatagridSortOrder } from './enums/sort-order.enum';
import { DATAGRID_SPEC_PROVIDERS } from './helpers';
import { ClrDatagridComparatorInterface } from './interfaces/comparator.interface';
import { ClrDatagridFilterInterface } from './interfaces/filter.interface';
import { ClrDatagridStringFilterInterface } from './interfaces/string-filter.interface';
import { DetailService } from './providers/detail.service';
import { FiltersProvider } from './providers/filters';
import { Sort } from './providers/sort';

describe('Datagrid', () => {
  describe('Components', () => {
    describe('DatagridColumn component', () => {
      const helpers = createTestHelpers();

      let testContext: any;
      beforeEach(() => {
        testContext = {};
      });

      describe('Typescript API', () => {
        let context: TestContext<ClrDatagridColumn, SimpleTest>;
        let sortService: Sort<number>;
        let comparator: TestComparator;
        let component: ClrDatagridColumn<number>;

        beforeEach(() => {
          context = helpers.create(ClrDatagridColumn, SimpleTest, DATAGRID_SPEC_PROVIDERS);
          sortService = context.getClarityProvider(Sort);
          component = context.clarityDirective;
          comparator = new TestComparator();
        });

        afterEach(() => {
          context.fixture.destroy();
          const popoverContent = document.querySelectorAll('.clr-popover-content');
          popoverContent.forEach(content => document.body.removeChild(content));
        });

        it('receives a comparator to sort the column', () => {
          expect(component.sortable).toBe(false);
          component.sortBy = comparator;
          expect(component.sortable).toBe(true);
        });

        it('can sort according to the given comparator', () => {
          component.sortBy = comparator;
          expect(sortService.comparator).toBeUndefined();
          component.sort();
          expect(sortService.comparator).toBe(component.sortBy);
          expect(sortService.reverse).toBe(false);
          component.sort();
          expect(sortService.comparator).toBe(component.sortBy);
          expect(sortService.reverse).toBe(true);
        });

        it("doesn't sort without a comparator", () => {
          expect(sortService.comparator).toBeUndefined();
          component.sort();
          expect(sortService.comparator).toBeUndefined();
        });

        it('knows if the column is currently sorted', () => {
          component.sortBy = comparator;
          expect(component.sortOrder).toBe(ClrDatagridSortOrder.UNSORTED);
          component.sort();
          expect(component.sortOrder).toBe(ClrDatagridSortOrder.ASC);
          component.sort();
          expect(component.sortOrder).toBe(ClrDatagridSortOrder.DESC);
        });

        it('sorts according to the optional input parameter', () => {
          component.sortBy = comparator;
          expect(component.sortOrder).toBe(ClrDatagridSortOrder.UNSORTED);
          component.sort(true);
          expect(component.sortOrder).toBe(ClrDatagridSortOrder.DESC);
          component.sort(true);
          expect(component.sortOrder).toBe(ClrDatagridSortOrder.DESC);
          component.sort(false);
          expect(component.sortOrder).toBe(ClrDatagridSortOrder.ASC);
        });

        it('knows the column current sorting order', () => {
          component.sortBy = comparator;
          expect(component.sortOrder).toBe(ClrDatagridSortOrder.UNSORTED);
          component.sort();
          expect(component.sortOrder).toBe(ClrDatagridSortOrder.ASC);
          component.sort();
          expect(component.sortOrder).toBe(ClrDatagridSortOrder.DESC);
          component.sort();
          expect(component.sortOrder).toBe(ClrDatagridSortOrder.UNSORTED);
        });

        it('knows when the column has an ascending sortDirection', () => {
          component.sortBy = comparator;
          expect(component.sortDirection).toBeUndefined();
          component.sort();
          expect(component.sortDirection).toBe('up');
        });

        it('knows when the column has a descending sortDirection', () => {
          component.sortBy = comparator;
          expect(component.sortDirection).toBeUndefined();
          component.sort();
          component.sort();
          expect(component.sortDirection).toBe('down');
        });

        it('sets the column sortDirection to null when sort is cleared', () => {
          component.sortBy = comparator;
          expect(component.sortDirection).toBeUndefined();
          component.sort();
          sortService.clear();
          expect(component.sortDirection).toBeNull();
        });

        it('sets the column sortDirection to null when sort is rotated to initial state', () => {
          component.sortBy = comparator;
          expect(component.sortDirection).toBeUndefined();
          component.sort();
          component.sort();
          component.sort();
          expect(component.sortDirection).toBeNull();
        });

        it('offers a shortcut to sort based on a property name', () => {
          component.field = 'test';
          expect(sortService.comparator).toBeUndefined();
          component.sort();
          expect(sortService.comparator).toEqual(new DatagridPropertyComparator('test'));
        });

        it('sorts based on a property name if sortyBy is undefined', () => {
          component.field = 'test';
          component.sortBy = undefined;
          expect(sortService.comparator).toBeUndefined();
          component.sort();
          expect(sortService.comparator).toEqual(new DatagridPropertyComparator('test'));
        });

        it('sorts based on a property name if sortyBy becomes undefined', () => {
          component.sortBy = comparator;
          component.field = 'test';
          component.sortBy = undefined;
          expect(sortService.comparator).toBeUndefined();
          component.sort();
          expect(sortService.comparator).toEqual(new DatagridPropertyComparator('test'));
        });

        it('sorts based on a property shortcut for sortBy without a given comparator', () => {
          component.sortBy = 'test';
          expect(sortService.comparator).toBeUndefined();
          component.sort();
          expect(sortService.comparator).toEqual(new DatagridPropertyComparator('test'));
        });
      });

      describe('Template API', () => {
        it('provides a wrapped view for the content', () => {
          testContext.context = helpers.create(ClrDatagridColumn, SimpleTest, DATAGRID_SPEC_PROVIDERS);
          testContext.directive = testContext.context.clarityDirective;
          expect(testContext.directive._view).toBeDefined();
        });

        it('receives an input for the comparator', () => {
          testContext.context = helpers.create(ClrDatagridColumn, SimpleTest, DATAGRID_SPEC_PROVIDERS);
          testContext.comparator = new TestComparator();
          testContext.context.testComponent.comparator = testContext.comparator;
          testContext.context.detectChanges();
          expect(testContext.context.clarityDirective.sortBy).toBe(testContext.comparator);
        });

        it('receives a string input for the property shortcut comparator', () => {
          testContext.context = helpers.create(ClrDatagridColumn, SimpleTest, DATAGRID_SPEC_PROVIDERS);
          testContext.comparator = new DatagridPropertyComparator('test');
          testContext.context.testComponent.comparator = 'test';
          testContext.context.detectChanges();
          expect(testContext.context.clarityDirective.sortBy).toEqual(testContext.comparator);
        });

        it('receives an input for the property name', () => {
          testContext.context = helpers.create(ClrDatagridColumn, SimpleTest, DATAGRID_SPEC_PROVIDERS);
          testContext.context.testComponent.field = 'test';
          testContext.context.detectChanges();
          expect(testContext.context.clarityDirective.field).toBe('test');
        });

        it('receives an input for the property filter value', () => {
          testContext.context = helpers.create(ClrDatagridColumn, PreFilterTest, DATAGRID_SPEC_PROVIDERS);
          testContext.context.testComponent.field = 'test';
          testContext.context.testComponent.filterValue = 'M';
          testContext.context.detectChanges();
          expect(testContext.context.clarityDirective.filterValue).toBe('M');
        });

        it('offers two-way binding on the sortOrder state', () => {
          testContext.context = helpers.create(ClrDatagridColumn, SimpleTest, DATAGRID_SPEC_PROVIDERS);
          testContext.comparator = new TestComparator();
          testContext.context.testComponent.comparator = testContext.comparator;
          testContext.context.testComponent.sortOrder = ClrDatagridSortOrder.DESC;
          testContext.context.detectChanges();
          expect(testContext.context.clarityDirective.sortOrder).toBe(ClrDatagridSortOrder.DESC); // dg col instance
          testContext.context.getClarityProvider(Sort).clear();
          testContext.context.detectChanges();
          expect(testContext.context.testComponent.sortOrder).toBe(ClrDatagridSortOrder.UNSORTED);
          testContext.context.clarityDirective.sortOrder = ClrDatagridSortOrder.ASC;
          testContext.context.detectChanges();
          expect(testContext.context.testComponent.sortOrder).toBe(ClrDatagridSortOrder.ASC);
        });

        it('offers two-way binding on the filtered state', () => {
          testContext.context = helpers.create(ClrDatagridColumn, PreFilterTest, DATAGRID_SPEC_PROVIDERS);
          testContext.context.testComponent.field = 'test';
          testContext.context.testComponent.filterValue = 'M';
          testContext.context.detectChanges();
          expect(testContext.context.clarityDirective.filterValue).toBe('M');

          testContext.context.clarityDirective.filterValue = 't';
          testContext.context.detectChanges();
          expect(testContext.context.testComponent.filterValue).toBe('t');
        });

        it('should emit on string filter value changes', () => {
          testContext.context = helpers.create(ClrDatagridColumn, PreFilterTest, DATAGRID_SPEC_PROVIDERS);
          testContext.context.testComponent.field = 'test';

          testContext.context.detectChanges();

          const stringFilterDebugElement = testContext.context.fixture.debugElement.query(
            By.directive(DatagridStringFilter)
          );
          const stringFilterComponent = stringFilterDebugElement.injector.get(DatagridStringFilter);

          stringFilterComponent.value = 'T';
          expect(testContext.context.testComponent.filterValue).toBe('T');

          stringFilterComponent.value = '';
          expect(testContext.context.testComponent.filterValue).toBe('');

          stringFilterComponent.value = 'm';
          expect(testContext.context.testComponent.filterValue).toBe('m');
        });

        it('accepts a custom filter in the projected content', () => {
          testContext.context = helpers.create(ClrDatagridColumn, FilterTest, DATAGRID_SPEC_PROVIDERS);
          expect(TestBed.inject(FiltersProvider).getActiveFilters()).toEqual([
            testContext.context.testComponent.filter,
          ]);
        });

        it('accepts a custom string filter in the projected content', () => {
          testContext.context = helpers.create(ClrDatagridColumn, StringFilterTest, DATAGRID_SPEC_PROVIDERS);
          testContext.stringFilter = testContext.context.testComponent.stringFilter.filter;
          // We make the filter active to see if the FiltersProvider provider knows about it
          testContext.stringFilter.value = 'hello';
          testContext.context.detectChanges();
          expect(TestBed.inject(FiltersProvider).getActiveFilters()).toEqual([testContext.stringFilter]);
        });

        it('prioritizes custom comparators over the default property name one', () => {
          testContext.context = helpers.create(ClrDatagridColumn, SimpleTest, DATAGRID_SPEC_PROVIDERS);
          testContext.comparator = new TestComparator();
          testContext.context.testComponent.comparator = testContext.comparator;
          testContext.context.detectChanges();
          testContext.context.testComponent.field = 'test';
          testContext.context.detectChanges();
          expect(testContext.context.clarityDirective.sortBy).toBe(testContext.comparator);
        });

        it('prioritizes custom filters over the default property name one', () => {
          testContext.context = helpers.create(ClrDatagridColumn, FilterTest, DATAGRID_SPEC_PROVIDERS);
          testContext.context.testComponent.field = 'test';
          testContext.context.detectChanges();
          expect(testContext.context.clarityElement.querySelectorAll('clr-dg-filter').length).toBe(1);
          expect(TestBed.inject(FiltersProvider).getActiveFilters()).toEqual([
            testContext.context.testComponent.filter,
          ]);
        });

        it('prioritizes custom string filters over the default property name one', () => {
          testContext.context = helpers.create(ClrDatagridColumn, StringFilterTest, DATAGRID_SPEC_PROVIDERS);
          testContext.context.testComponent.field = 'test';
          testContext.context.detectChanges();
          testContext.stringFilter = testContext.context.testComponent.stringFilter.filter;
          // We make the filter active to see if the FiltersProvider provider knows about it
          testContext.stringFilter.value = 'hello';
          testContext.context.detectChanges();
          expect(testContext.context.clarityElement.querySelectorAll('clr-dg-filter').length).toBe(1);
          expect(TestBed.inject(FiltersProvider).getActiveFilters()).toEqual([testContext.stringFilter]);
        });
      });

      describe('View basics', () => {
        let context: TestContext<ClrDatagridColumn<number | string>, SimpleTest>;

        beforeEach(() => {
          context = helpers.create(ClrDatagridColumn, SimpleTest, DATAGRID_SPEC_PROVIDERS);
        });

        it('projects content', () => {
          expect(context.clarityElement.textContent.trim()).toMatch('Hello world');
        });

        it('adds the .datagrid-column class to the host', () => {
          expect(context.clarityElement.classList.contains('datagrid-column')).toBeTruthy();
        });

        it('displays a clickable column title to sort if the column is sortable', () => {
          let title = context.clarityElement.querySelector('.datagrid-column-title');
          expect(title.tagName).toBe('SPAN');
          title.click();
          context.detectChanges();
          expect(context.clarityDirective.sortOrder).toBe(ClrDatagridSortOrder.UNSORTED);
          context.testComponent.comparator = new TestComparator();
          context.detectChanges();
          title = context.clarityElement.querySelector('.datagrid-column-title');
          expect(title.tagName).toBe('BUTTON');
          title.click();
          context.detectChanges();
          expect(context.clarityDirective.sortOrder).toBe(ClrDatagridSortOrder.ASC);
          title.click();
          context.detectChanges();
          expect(context.clarityDirective.sortOrder).toBe(ClrDatagridSortOrder.DESC);
          title.click();
          context.detectChanges();
          expect(context.clarityDirective.sortOrder).toBe(ClrDatagridSortOrder.UNSORTED);
        });

        it('adds and removes the correct direction when sorting', () => {
          context.clarityDirective.sortBy = new TestComparator();
          context.clarityDirective.sort();
          context.detectChanges();

          const arrowIcon = context.clarityElement.querySelector('.sort-icon');
          expect(arrowIcon.getAttribute('direction')).toEqual('up');

          context.clarityDirective.sort();
          context.detectChanges();
          expect(arrowIcon.getAttribute('direction')).toEqual('down');

          const sortService = context.fixture.debugElement.query(By.directive(ClrDatagridColumn)).injector.get(Sort);
          sortService.clear();
          context.detectChanges();

          expect(arrowIcon.getAttribute('shape')).toBe('two-way-arrows');
          expect(arrowIcon.getAttribute('direction')).toBe('left');
        });

        it('should add aria-hidden=true to sort-icon', () => {
          context.clarityDirective.sortBy = new TestComparator();
          context.clarityDirective.sort();
          context.detectChanges();

          const arrowIcon = context.clarityElement.querySelector('.sort-icon');
          expect(arrowIcon.getAttribute('aria-hidden')).toBe('true');
        });

        it('adds a11y roles to the column', () => {
          expect(context.clarityElement.attributes.role.value).toEqual('columnheader');
          expect(context.clarityElement.attributes['aria-sort'].value).toBe('none');

          context.clarityDirective.sortBy = new TestComparator();
          context.clarityDirective.sort();
          context.detectChanges();
          expect(context.clarityElement.attributes['aria-sort'].value).toBe('ascending');

          context.clarityDirective.sort();
          context.detectChanges();
          expect(context.clarityElement.attributes['aria-sort'].value).toBe('descending');
        });
      });

      describe('View filters', () => {
        it("doesn't display any filter by default", () => {
          testContext.context = helpers.create(ClrDatagridColumn, SimpleTest, DATAGRID_SPEC_PROVIDERS);
          expect(testContext.context.clarityElement.querySelector('clr-dg-filter')).toBeNull();
        });

        it('displays a string filter when using a property name', () => {
          testContext.context = helpers.create(ClrDatagridColumn, SimpleTest, DATAGRID_SPEC_PROVIDERS);
          testContext.context.testComponent.field = 'test';
          testContext.context.detectChanges();
          expect(testContext.context.clarityElement.querySelector('clr-dg-string-filter')).not.toBeNull();
        });

        it('projects custom filters outside of the title', () => {
          testContext.context = helpers.create(ClrDatagridColumn, FilterTest, DATAGRID_SPEC_PROVIDERS);
          expect(testContext.context.clarityElement.querySelector('.my-filter')).not.toBeNull();
          const title = testContext.context.clarityElement.querySelector('.datagrid-column-title');
          expect(title.querySelector('.my-filter')).toBeNull();
        });

        it('projects custom string filters outside of the title', () => {
          testContext.context = helpers.create(ClrDatagridColumn, StringFilterTest, DATAGRID_SPEC_PROVIDERS);
          expect(testContext.context.clarityElement.querySelector('.my-string-filter')).not.toBeNull();
          const title = testContext.context.clarityElement.querySelector('.datagrid-column-title');
          expect(title.querySelector('.my-string-filter')).toBeNull();
        });

        it('un-registers the correct filter', () => {
          testContext.context = helpers.create(ClrDatagridColumn, UnregisterTest, DATAGRID_SPEC_PROVIDERS);
          testContext.context.testComponent.show = true;
          testContext.context.clarityDirective.filters.add(new TestFilter());
          testContext.context.clarityDirective.filters.add(new TestFilter());
          testContext.context.detectChanges();
          const activeFilters = testContext.context.clarityDirective.filters.getActiveFilters();
          expect(activeFilters.length).toBe(3);
          testContext.context.testComponent.show = false;
          testContext.context.detectChanges();
          const activeFiltersTest = testContext.context.clarityDirective.filters.getActiveFilters();
          expect(activeFiltersTest.length).toBe(2);
        });
      });

      describe('Build-in string and numeric filters', () => {
        let context;

        beforeEach(() => {
          context = helpers.create(ClrDatagridColumn, ColTypeTest, DATAGRID_SPEC_PROVIDERS);
        });

        it('should let you set `number` as clrDgColType', () => {
          context.testComponent.type = 'number';
          context.detectChanges();
          expect(context.clarityDirective.colType).toBe('number');
        });

        it('should let you set `string` as clrDgColType', () => {
          context.testComponent.type = 'string';
          context.detectChanges();
          expect(context.clarityDirective.colType).toBe('string');
        });

        it('when setting clrDgColType to `number` it should use the numeric filter', () => {
          context.testComponent.type = 'number';
          context.testComponent.field = 'id';
          context.detectChanges();
          expect(context.clarityDirective.registered.filter instanceof DatagridNumericFilterImpl).toBe(true);
          expect(context.clarityElement.querySelector('clr-dg-numeric-filter')).toBeDefined();
        });

        it('when clrDgColType is set to `string` it shoul use the string filter', () => {
          context.testComponent.type = 'string';
          context.testComponent.field = 'id';
          context.detectChanges();
          expect(context.clarityDirective.registered.filter instanceof DatagridStringFilterImpl).toBe(true);
          expect(context.clarityElement.querySelector('clr-dg-string-filter')).toBeDefined();
        });

        it('order of the argument should not have effect when settings filters', () => {
          context.testComponent.field = 'id';
          context.testComponent.type = 'number';
          context.detectChanges();
          expect(context.clarityDirective.registered.filter instanceof DatagridNumericFilterImpl).toBe(true);
          expect(context.clarityElement.querySelector('clr-dg-numeric-filter')).toBeDefined();
        });
      });

      describe('Column View Changes On ChangeDetectionStrategy.OnPush', () => {
        beforeEach(() => {
          testContext.context = helpers.create(ClrDatagridColumn, OnPushViewChangeTest, DATAGRID_SPEC_PROVIDERS);
        });

        it('hides the separator when detail pane is open', () => {
          const detailService = testContext.context.getClarityProvider(DetailService);
          expect(testContext.context.clarityElement.querySelector('.datagrid-column-separator')).toBeTruthy();
          detailService.open({});
          testContext.context.detectChanges();
          expect(testContext.context.clarityElement.querySelector('.datagrid-column-separator')).toBeFalsy();
        });

        it('toggles sort icon if sort is activated or deactivated', () => {
          // activates column's sorting
          testContext.context.clarityDirective.sort();
          testContext.context.detectChanges();

          const sortIcon = testContext.context.clarityElement.querySelector('.sort-icon');
          expect(sortIcon).not.toBeNull();
          expect(sortIcon.getAttribute('shape')).toBe('arrow');
          expect(sortIcon.getAttribute('direction')).toBe('up');

          // deactivate column's sorting by passing new test comparator
          testContext.context.getClarityProvider(Sort).toggle(new TestComparator());
          testContext.context.detectChanges();

          expect(sortIcon.getAttribute('shape')).toBe('two-way-arrows');
          expect(sortIcon.getAttribute('direction')).toBe('left');
        });
      });
    });
  });
});

class TestComparator implements ClrDatagridComparatorInterface<number> {
  compare(_a: number, _b: number): number {
    return 0;
  }
}

class TestFilter implements ClrDatagridFilterInterface<number> {
  changes = new Subject<boolean>();

  isActive(): boolean {
    return true;
  }

  accepts(_n: number): boolean {
    return true;
  }
}

class TestStringFilter implements ClrDatagridStringFilterInterface<number> {
  accepts(_n: number, _search: string): boolean {
    return true;
  }
}

@Component({
  template: `
    <clr-dg-column [clrDgSortBy]="comparator" [clrDgField]="field" [(clrDgSortOrder)]="sortOrder">
      Hello world
    </clr-dg-column>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class SimpleTest {
  comparator: ClrDatagridComparatorInterface<number> | string;
  field: string;
  sortOrder = ClrDatagridSortOrder.UNSORTED;
}

@Component({
  template: `
    <clr-dg-column [clrDgField]="field">
      Column title
      <clr-dg-filter class="my-filter" [clrDgFilter]="filter">Filter content</clr-dg-filter>
    </clr-dg-column>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class FilterTest {
  filter = new TestFilter();
  field: string;
}

@Component({
  template: `
    <clr-dg-column [clrDgField]="field" [(clrFilterValue)]="filterValue">
      Hello world
      <clr-dg-string-filter class="my-string-filter" [clrDgStringFilter]="filter"></clr-dg-string-filter>
    </clr-dg-column>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class StringFilterTest {
  filter = new TestStringFilter();
  field: string;
  filterValue = '';

  @ViewChild(DatagridStringFilter) stringFilter: DatagridStringFilter<number>;
}

@Component({
  template: `<clr-dg-column [(clrFilterValue)]="filterValue" [clrDgField]="field">Column Title</clr-dg-column>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class PreFilterTest {
  field: string;
  filterValue: string;
}

@Component({
  template: `
    <clr-dg-column>
      Column Title
      @if (show) {
        <clr-dg-string-filter [(clrFilterValue)]="filterValue" [clrDgStringFilter]="filter"></clr-dg-string-filter>
      }
    </clr-dg-column>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class UnregisterTest {
  show: boolean;
  filter = new TestStringFilter();
  filterValue = 'M';
}

@Component({
  template: `<clr-dg-column [clrDgField]="field" [clrDgColType]="type">Column Title</clr-dg-column>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class ColTypeTest {
  field: string;
  type: string;
}

// There should be only a limited number of input bindings in this testing case
// as it tries to reflect view changes that's not dependent on input changes
@Component({
  template: `<clr-dg-column [clrDgField]="'test'">Hello World</clr-dg-column>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class OnPushViewChangeTest {}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ClrPopoverService } from '@clr/angular/popover/common';
import { createTestHelpers, TestContext } from '@clr/angular/testing';
import { ClrCommonStringsService } from '@clr/angular/utils';
import { Subject } from 'rxjs';

import { ClrDatagridFilter } from './datagrid-filter';
import { DATAGRID_SPEC_PROVIDERS } from './helpers';
import { ClrDatagridFilterInterface } from './interfaces/filter.interface';
import { CustomFilter } from './providers/custom-filter';
import { FiltersProvider } from './providers/filters';
import { Page } from './providers/page';
import { StateDebouncer } from './providers/state-debouncer.provider';
import { KeyNavigationGridController } from './utils/key-navigation-grid.controller';

function cleanPopoverDOM(component: ClrDatagridFilter) {
  const popoverContent = document.querySelectorAll('.datagrid-filter');
  popoverContent.forEach(content => content.remove());
  component.ngOnDestroy();
}

describe('Datagrid', () => {
  describe('Components', () => {
    describe('ClrDatagridFilter component', () => {
      const helpers = createTestHelpers();

      describe('Typescript API', () => {
        let filterService: FiltersProvider<number>;
        let filter: TestFilter;
        let component: ClrDatagridFilter<number>;
        let popoverService: ClrPopoverService;

        beforeEach(() => {
          const stateDebouncer = new StateDebouncer();
          filterService = new FiltersProvider(new Page(stateDebouncer), stateDebouncer);
          popoverService = new ClrPopoverService();
          filter = new TestFilter();

          // No key navigation and no column actions service: this suite drives the filter on its own,
          // outside a column.
          component = new ClrDatagridFilter(
            filterService,
            new ClrCommonStringsService(),
            popoverService,
            undefined,
            undefined
          );
        });

        afterEach(() => {
          cleanPopoverDOM(component);
        });

        it('registers to the FiltersProvider provider', () => {
          expect(filterService.getActiveFilters()).toEqual([]);
          component.customFilter = filter;
          expect(filterService.getActiveFilters()).toEqual([filter]);
        });

        it('unregisters when destroyed', () => {
          component.customFilter = filter;
          expect(filterService.getActiveFilters()).toEqual([filter]);
          component.ngOnDestroy();
          expect(filterService.getActiveFilters()).toEqual([]);
        });

        it('detects if the filter is active', () => {
          expect(component.active).toEqual(false);
          component.customFilter = filter;
          expect(component.active).toEqual(true);
          filter.active = false;
          expect(component.active).toEqual(false);
        });
      });

      // The grid's key navigation has to stand down while the filter is open, however it was opened -
      // its own toggle and the column actions menu drive the popover directly, not the open input.
      describe('key navigation', () => {
        let popoverService: ClrPopoverService;
        let keyNavigation: KeyNavigationGridController;
        let component: ClrDatagridFilter<number>;

        beforeEach(() => {
          const stateDebouncer = new StateDebouncer();
          popoverService = new ClrPopoverService();
          keyNavigation = { skipItemFocus: false } as KeyNavigationGridController;
          component = new ClrDatagridFilter(
            new FiltersProvider(new Page(stateDebouncer), stateDebouncer),
            new ClrCommonStringsService(),
            popoverService,
            keyNavigation,
            undefined
          );
        });

        afterEach(() => {
          cleanPopoverDOM(component);
        });

        it('skips item focus while the popover is open, even when opened directly', () => {
          popoverService.open = true;
          expect(keyNavigation.skipItemFocus).toBe(true);

          popoverService.open = false;
          expect(keyNavigation.skipItemFocus).toBe(false);
        });

        it('skips item focus when opened through the open input', () => {
          component.open = true;
          expect(keyNavigation.skipItemFocus).toBe(true);

          component.open = false;
          expect(keyNavigation.skipItemFocus).toBe(false);
        });
      });

      describe('Template API', () => {
        let context: TestContext<ClrDatagridFilter<number>, FullTest>;
        let filter: TestFilter;
        let popoverService: ClrPopoverService;

        beforeEach(() => {
          filter = new TestFilter();
          context = helpers.create(ClrDatagridFilter, FullTest, DATAGRID_SPEC_PROVIDERS);
          popoverService = context.getClarityProvider(ClrPopoverService);
        });

        it('receives an input for the filter logic', () => {
          context.testComponent.filter = filter;
          context.detectChanges();
          expect(context.clarityDirective.filter).toBe(filter);
        });

        it('offers two-way binding on he open state of the filter dropdown', () => {
          context.testComponent.filter = filter;
          context.testComponent.open = true;
          context.detectChanges();
          expect(popoverService.open).toBe(true);
          context.clarityDirective.open = false;
          context.detectChanges();
          expect(popoverService.open).toBe(false);
        });

        it('registers itself as a CustomFilter provider', () => {
          expect(context.testComponent.customFilter).toBe(context.clarityDirective);
        });
      });

      describe('View', () => {
        let context: TestContext<ClrDatagridFilter<number>, FullTest>;
        let filter: TestFilter;

        beforeEach(() => {
          filter = new TestFilter();
          context = helpers.create(ClrDatagridFilter, FullTest, DATAGRID_SPEC_PROVIDERS);
          context.testComponent.filter = filter;
          context.detectChanges();
        });

        afterEach(() => {
          cleanPopoverDOM(context.clarityDirective);
        });

        it('correctly associates the popover content with the aria-controls value', () => {
          const toggle: HTMLButtonElement = context.clarityElement.querySelector('.datagrid-filter-toggle');
          toggle.click();
          context.detectChanges();
          const popover: HTMLDivElement = document.querySelector('.datagrid-filter');
          expect(toggle.getAttribute('aria-controls')).toEqual(popover.getAttribute('id'));
        });

        it('correctly updates the aria-expanded state', () => {
          const toggle: HTMLButtonElement = context.clarityElement.querySelector('.datagrid-filter-toggle');
          expect(toggle.getAttribute('aria-expanded')).toBe('false');
          toggle.click();
          context.detectChanges();
          expect(toggle.getAttribute('aria-expanded')).toBe('true');
        });

        it('has a button with the correct aria-label', async () => {
          await context.fixture.whenStable();
          context.detectChanges();
          const toggle: HTMLButtonElement = context.clarityElement.querySelector('.datagrid-filter-toggle');
          expect(toggle.getAttribute('aria-label')).toBe('user filter');
        });

        it('has role and label on the filter dialog', () => {
          const openBtn: HTMLButtonElement = context.clarityElement.querySelector('.clr-smart-open-close');
          openBtn.click();
          context.detectChanges();
          const popoverContent = document.querySelector('.datagrid-filter');
          expect(popoverContent.getAttribute('role')).toBe('dialog');
          expect(popoverContent.getAttribute('aria-label')).toBe('Filter');
        });

        it('projects content into the dropdown', () => {
          const openBtn: HTMLButtonElement = context.clarityElement.querySelector('.clr-smart-open-close');
          const prePopoverContent = document.querySelector('.datagrid-filter');
          expect(prePopoverContent).toBeNull();
          openBtn.click();
          context.detectChanges();
          const popoverContent = document.querySelector('.datagrid-filter');
          expect(popoverContent.textContent.trim()).toMatch('Filter content');
        });

        it('opens and closes the dropdown when the toggle is clicked', () => {
          const toggle = context.clarityElement.querySelector('.datagrid-filter-toggle');
          expect(context.clarityDirective.open).toBe(false);
          toggle.click();
          context.detectChanges();
          expect(context.clarityDirective.open).toBe(true);
          toggle.click();
          context.detectChanges();
          expect(context.clarityDirective.open).toBe(false);
        });

        it('should call clrDgFilterOpenChange output when open changed', () => {
          vi.spyOn(context.fixture.componentInstance, 'clrDgFilterOpenChangeFn').mockImplementation(() => undefined);
          const toggle = context.clarityElement.querySelector('.datagrid-filter-toggle');
          toggle.click();
          expect(context.fixture.componentInstance.clrDgFilterOpenChangeFn).toHaveBeenCalledWith(true);
          toggle.click();
          expect(context.fixture.componentInstance.clrDgFilterOpenChangeFn).toHaveBeenCalledWith(true);
        });
      });
    });
  });
});

class TestFilter implements ClrDatagridFilterInterface<number> {
  active = true;
  changes = new Subject<boolean>();

  isActive(): boolean {
    return this.active;
  }

  accepts(_n: number): boolean {
    return true;
  }
}

@Component({
  template: `
    <clr-dg-column>
      User
      <clr-dg-filter
        [clrDgFilter]="filter"
        [clrDgFilterOpen]="open"
        (clrDgFilterOpenChange)="clrDgFilterOpenChangeFn($event)"
      >
        Filter content
      </clr-dg-filter>
    </clr-dg-column>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class FullTest {
  @ViewChild(CustomFilter) customFilter: CustomFilter;

  filter: ClrDatagridFilterInterface<number>;
  open = false;

  clrDgFilterOpenChangeFn = (_$event: boolean) => {
    // Do nothing
  };
}

/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrPopoverEventsService } from '../../utils/popover/providers/popover-events.service';
import { ClrPopoverPositionService } from '../../utils/popover/providers/popover-position.service';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { ClrDatagridFilter } from './datagrid-filter';
import { DATAGRID_SPEC_PROVIDERS, TestContext } from './helpers.spec';
import { ClrDatagridFilterInterface } from './interfaces/filter.interface';
import { CustomFilter } from './providers/custom-filter';
import { FiltersProvider } from './providers/filters';
import { Page } from './providers/page';
import { StateDebouncer } from './providers/state-debouncer.provider';

function cleanPopoverDOM(component: ClrDatagridFilter) {
  const popoverContent = document.querySelectorAll('.clr-popover-content');
  popoverContent.forEach(content => document.body.removeChild(content));
  component.ngOnDestroy();
}

export default function (): void {
  describe('ClrDatagridFilter component', function () {
    describe('Typescript API', function () {
      let filterService: FiltersProvider<number>;
      let filter: TestFilter;
      let component: ClrDatagridFilter<number>;
      let toggleService: ClrPopoverToggleService;

      beforeEach(function () {
        const stateDebouncer = new StateDebouncer();
        filterService = new FiltersProvider(new Page(stateDebouncer), stateDebouncer);
        toggleService = new ClrPopoverToggleService();
        filter = new TestFilter();
        component = new ClrDatagridFilter(
          filterService,
          new ClrCommonStringsService(),
          toggleService,
          'browser' as any,
          undefined
        );
      });

      afterEach(function () {
        cleanPopoverDOM(component);
      });

      it('registers to the FiltersProvider provider', function () {
        expect(filterService.getActiveFilters()).toEqual([]);
        component.customFilter = filter;
        expect(filterService.getActiveFilters()).toEqual([filter]);
      });

      it('unregisters when destroyed', function () {
        component.customFilter = filter;
        expect(filterService.getActiveFilters()).toEqual([filter]);
        component.ngOnDestroy();
        expect(filterService.getActiveFilters()).toEqual([]);
      });

      it('detects if the filter is active', function () {
        expect(component.active).toEqual(false);
        component.customFilter = filter;
        expect(component.active).toEqual(true);
        filter.active = false;
        expect(component.active).toEqual(false);
      });
    });

    describe('Template API', function () {
      // Until we can properly type "this"
      let context: TestContext<ClrDatagridFilter<number>, FullTest>;
      let filter: TestFilter;
      let toggleService: ClrPopoverToggleService;

      beforeEach(function (this: any) {
        filter = new TestFilter();
        context = this.create(ClrDatagridFilter, FullTest, DATAGRID_SPEC_PROVIDERS);
        toggleService = context.getClarityProvider(ClrPopoverToggleService);
      });

      it('receives an input for the filter logic', function () {
        context.testComponent.filter = filter;
        context.detectChanges();
        expect(context.clarityDirective.filter).toBe(filter);
      });

      it('offers two-way binding on he open state of the filter dropdown', function () {
        context.testComponent.filter = filter;
        context.testComponent.open = true;
        context.detectChanges();
        expect(toggleService.open).toBe(true);
        context.clarityDirective.open = false;
        context.detectChanges();
        expect(toggleService.open).toBe(false);
      });

      it('registers itself as a CustomFilter provider', function () {
        expect(context.testComponent.customFilter).toBe(context.clarityDirective);
      });
    });

    describe('View', function () {
      let context: TestContext<ClrDatagridFilter<number>, FullTest>;
      let filter: TestFilter;

      beforeEach(function (this: any) {
        filter = new TestFilter();
        context = this.create(ClrDatagridFilter, FullTest, DATAGRID_SPEC_PROVIDERS);
        context.testComponent.filter = filter;
        context.detectChanges();
      });

      afterEach(function () {
        cleanPopoverDOM(context.clarityDirective);
      });

      it('correctly associates the popover content with the aria-controls value', function () {
        const toggle: HTMLButtonElement = context.clarityElement.querySelector('.datagrid-filter-toggle');
        toggle.click();
        context.detectChanges();
        const popover: HTMLDivElement = document.querySelector('.datagrid-filter');
        expect(toggle.getAttribute('aria-controls')).toEqual(popover.getAttribute('id'));
      });

      it('correctly updates the aria-expanded state', function () {
        const toggle: HTMLButtonElement = context.clarityElement.querySelector('.datagrid-filter-toggle');
        expect(toggle.getAttribute('aria-expanded')).toBe('false');
        toggle.click();
        context.detectChanges();
        expect(toggle.getAttribute('aria-expanded')).toBe('true');
      });

      it('has a button with the correct aria-label', function () {
        const toggle: HTMLButtonElement = context.clarityElement.querySelector('.datagrid-filter-toggle');
        expect(toggle.getAttribute('aria-label')).toBe('Toggle user filter');
      });

      it('has role and label on the filter dialog', function () {
        const openBtn: HTMLButtonElement = context.clarityElement.querySelector('.clr-smart-open-close');
        openBtn.click();
        context.detectChanges();
        const popoverContent = document.querySelector('.clr-popover-content');
        expect(popoverContent.getAttribute('role')).toBe('dialog');
        expect(popoverContent.getAttribute('aria-label')).toBe('Filter dialog');
      });

      it('projects content into the dropdown', function () {
        const openBtn: HTMLButtonElement = context.clarityElement.querySelector('.clr-smart-open-close');
        const prePopoverContent = document.querySelector('.clr-popover-content');
        expect(prePopoverContent).toBeNull();
        openBtn.click();
        context.detectChanges();
        const popoverContent = document.querySelector('.clr-popover-content');
        expect(popoverContent.textContent.trim()).toMatch('Filter content');
      });

      it('opens and closes the dropdown when the toggle is clicked', function () {
        const toggle = context.clarityElement.querySelector('.datagrid-filter-toggle');
        expect(context.clarityDirective.open).toBe(false);
        toggle.click();
        context.detectChanges();
        expect(context.clarityDirective.open).toBe(true);
        toggle.click();
        context.detectChanges();
        expect(context.clarityDirective.open).toBe(false);
      });

      it('should call clrDgFilterOpenChange output when open changed', function () {
        spyOn(context.fixture.componentInstance, 'clrDgFilterOpenChangeFn');
        const toggle = context.clarityElement.querySelector('.datagrid-filter-toggle');
        toggle.click();
        expect(context.fixture.componentInstance.clrDgFilterOpenChangeFn).toHaveBeenCalledWith(true);
        toggle.click();
        expect(context.fixture.componentInstance.clrDgFilterOpenChangeFn).toHaveBeenCalledWith(true);
      });
    });
  });
}

class TestFilter implements ClrDatagridFilterInterface<number> {
  active = true;

  isActive(): boolean {
    return this.active;
  }

  accepts(_n: number): boolean {
    return true;
  }

  changes = new Subject<boolean>();
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
  providers: [ClrPopoverEventsService, ClrPopoverPositionService],
})
class FullTest {
  @ViewChild(CustomFilter) customFilter: CustomFilter;

  filter: ClrDatagridFilterInterface<number>;
  open = false;

  clrDgFilterOpenChangeFn = (_$event: boolean) => {
    // Do nothing
  };
}

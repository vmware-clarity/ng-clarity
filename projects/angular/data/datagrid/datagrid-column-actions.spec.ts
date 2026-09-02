/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ClrPopoverService } from '@clr/angular/popover/common';
import { TestContext } from '@clr/angular/testing';
import { ClrCommonStringsService } from '@clr/angular/utils';

import { ClrDatagrid } from './datagrid';
import { ClrDatagridColumn } from './datagrid-column';
import { ClrDatagridSortOrder } from './enums/sort-order.enum';

const HEADER_PINNED = '.datagrid-header .datagrid-pinned-cells';
const TOGGLE = '.datagrid-header .datagrid-column-actions-toggle';

function queryAll(root: HTMLElement, selector: string): HTMLElement[] {
  return Array.from<HTMLElement>(root.querySelectorAll(selector));
}

function columnTitles(root: HTMLElement, container: string): string[] {
  return queryAll(root, `${container} > clr-dg-column .datagrid-column-title`).map(title => title.textContent.trim());
}

// The menu content is rendered into a CDK overlay attached to the body, so it is not reachable from
// the datagrid element once it is open.
//
// A global query is safe because clrIfOpen keeps closed menus out of the DOM entirely - only the open
// one is ever present. Before that, every column's menu stayed rendered and merely hidden, which made
// both the "omits" assertions and the open/closed checks meaningless.
function menuItems(): HTMLElement[] {
  return Array.from<HTMLElement>(document.querySelectorAll('.dropdown-menu .dropdown-item'));
}

function menuItemLabels(): string[] {
  return menuItems().map(item => item.textContent.trim());
}

function itemLabelled(label: string): HTMLElement {
  return menuItems().find(item => item.textContent.trim() === label);
}

function menuIsOpen(): boolean {
  return menuItems().length > 0;
}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column
        [clrDgSortBy]="sortBy"
        [clrDgDisableUnsort]="disableUnsort"
        [clrDgPinnable]="pinnable"
        [(clrDgPinned)]="firstPinned"
      >
        First
        <clr-dg-column-actions></clr-dg-column-actions>
      </clr-dg-column>
      <clr-dg-column>Second</clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items">
        <clr-dg-cell>{{ item }}</clr-dg-cell>
        <clr-dg-cell>{{ item * 2 }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
})
class ColumnActionsTest {
  items = [1, 2, 3];
  sortBy = 'x';
  disableUnsort = false;
  pinnable = true;
  firstPinned = false;
}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column>
        First
        <clr-dg-column-actions>
          <button type="button" clrDgColumnAction [clrDisabled]="customDisabled" class="custom-action">Custom</button>
        </clr-dg-column-actions>
      </clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items">
        <clr-dg-cell>{{ item }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
})
class ProjectedActionTest {
  items = [1];
  customDisabled = false;
}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column clrDgField="name">
        Filtered
        <clr-dg-column-actions></clr-dg-column-actions>
      </clr-dg-column>
      <clr-dg-column clrDgField="other">Plain</clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
        <clr-dg-cell>{{ item.name }}</clr-dg-cell>
        <clr-dg-cell>{{ item.other }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
})
class AutoFilterTest {
  items = [
    { name: 'aaa', other: 'x' },
    { name: 'bbb', other: 'y' },
  ];
}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column>
        No filter
        <clr-dg-column-actions></clr-dg-column-actions>
      </clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items">
        <clr-dg-cell>{{ item }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
})
class NoFilterTest {
  items = [1];
}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column clrDgField="name">
        Filtered
        <clr-dg-column-actions [clrDgKeepFilterInHeader]="keepInHeader"></clr-dg-column-actions>
      </clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
        <clr-dg-cell>{{ item.name }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
})
class KeepFilterInHeaderTest {
  items = [{ name: 'aaa' }, { name: 'bbb' }];
  keepInHeader = true;
}

export default function (): void {
  describe('ClrDatagridColumnActions', function () {
    describe('rendering', function () {
      let context: TestContext<ClrDatagrid, ColumnActionsTest>;
      let element: HTMLElement;

      function closeMenu() {
        if (menuIsOpen()) {
          element.querySelector<HTMLButtonElement>(TOGGLE).click();
          context.detectChanges();
        }
      }

      beforeEach(function () {
        context = this.create(ClrDatagrid, ColumnActionsTest);
        element = context.clarityElement;
      });

      afterEach(function () {
        // The menu lives in an overlay outside the fixture, so it has to be closed between tests.
        closeMenu();
      });

      it('only renders a trigger on columns that asked for the menu', function () {
        expect(queryAll(element, TOGGLE).length).toBe(1);
      });

      it('renders the trigger at the trailing edge of the header, not inside the sort button', function () {
        const headerCell = element.querySelector<HTMLElement>('.datagrid-header clr-dg-column .datagrid-column-flex');
        const actions = headerCell.querySelector('clr-dg-column-actions');

        expect(actions).not.toBeNull();
        expect(actions.parentElement).toBe(headerCell);
        expect(headerCell.querySelector('.datagrid-column-title clr-dg-column-actions')).toBeNull();
      });

      it('labels the trigger with the column it belongs to', function () {
        const commonStrings = new ClrCommonStringsService();

        expect(element.querySelector(TOGGLE).getAttribute('aria-label')).toBe(
          commonStrings.parse(commonStrings.keys.datagridColumnActionsAriaLabel, { COLUMN: 'First' })
        );
      });

      it('leaves the column title sortable', function () {
        const title = element.querySelector<HTMLButtonElement>('.datagrid-header .datagrid-column-title');
        expect(title.tagName).toBe('BUTTON');

        title.click();
        context.detectChanges();

        expect(context.clarityDirective.columns.first.sortOrder).toBe(ClrDatagridSortOrder.ASC);
      });
    });

    describe('item visibility', function () {
      let context: TestContext<ClrDatagrid, ColumnActionsTest>;
      let element: HTMLElement;
      let commonStrings: ClrCommonStringsService;

      // The trigger toggles, so opening has to be conditional. Several tests open the menu, act on an
      // item and then want it open again, and an unconditional click would close it instead.
      function openMenu() {
        if (!menuIsOpen()) {
          element.querySelector<HTMLButtonElement>(TOGGLE).click();
          context.detectChanges();
        }
      }

      function closeMenu() {
        if (menuIsOpen()) {
          element.querySelector<HTMLButtonElement>(TOGGLE).click();
          context.detectChanges();
        }
      }

      beforeEach(function () {
        context = this.create(ClrDatagrid, ColumnActionsTest);
        element = context.clarityElement;
        commonStrings = new ClrCommonStringsService();
      });

      afterEach(function () {
        closeMenu();
      });

      it('offers both sort directions on a sortable column', function () {
        openMenu();

        expect(menuItemLabels()).toContain(commonStrings.keys.sortColumnAscending);
        expect(menuItemLabels()).toContain(commonStrings.keys.sortColumnDescending);
      });

      it('omits the sort actions when the column cannot be sorted', function () {
        context.testComponent.sortBy = undefined;
        context.detectChanges();

        openMenu();

        expect(menuItemLabels()).not.toContain(commonStrings.keys.sortColumnAscending);
        expect(menuItemLabels()).not.toContain(commonStrings.keys.sortColumnDescending);
      });

      // Clear Sort always sits in the menu and is disabled instead of removed, so its position does
      // not shift as the sort state changes.
      it('enables clearing the sort only once the column is sorted', function () {
        openMenu();
        expect(itemLabelled(commonStrings.keys.clearColumnSort).hasAttribute('disabled')).toBeTrue();

        itemLabelled(commonStrings.keys.sortColumnAscending).click();
        context.detectChanges();

        openMenu();
        expect(itemLabelled(commonStrings.keys.clearColumnSort).hasAttribute('disabled')).toBeFalse();
      });

      it('never enables clearing the sort when the column disabled unsorting', function () {
        context.testComponent.disableUnsort = true;
        context.detectChanges();

        openMenu();
        itemLabelled(commonStrings.keys.sortColumnAscending).click();
        context.detectChanges();

        openMenu();
        expect(itemLabelled(commonStrings.keys.clearColumnSort).hasAttribute('disabled')).toBeTrue();
      });

      it('omits the pin action when the column is not pinnable', function () {
        context.testComponent.pinnable = false;
        context.detectChanges();

        openMenu();

        expect(menuItemLabels()).not.toContain(commonStrings.keys.pinColumn);
      });
    });

    describe('projected actions', function () {
      let context: TestContext<ClrDatagrid, ProjectedActionTest>;
      let element: HTMLElement;

      beforeEach(function () {
        context = this.create(ClrDatagrid, ProjectedActionTest);
        element = context.clarityElement;
      });

      afterEach(function () {
        closeMenu();
      });

      // The trigger toggles, so opening has to be conditional. Several tests open the menu, act on an
      // item and then want it open again, and an unconditional click would close it instead.
      function openMenu() {
        if (!menuIsOpen()) {
          element.querySelector<HTMLButtonElement>(TOGGLE).click();
          context.detectChanges();
        }
      }

      function closeMenu() {
        if (menuIsOpen()) {
          element.querySelector<HTMLButtonElement>(TOGGLE).click();
          context.detectChanges();
        }
      }

      it('appends projected actions after the built-in ones', function () {
        openMenu();

        const labels = menuItemLabels();
        expect(labels).toContain('Custom');
        expect(labels.indexOf('Custom')).toBe(labels.length - 1);
      });

      it('styles a projected action as a menu item', function () {
        openMenu();

        const custom = itemLabelled('Custom');
        expect(custom.classList).toContain('dropdown-item');
        expect(custom.getAttribute('role')).toBe('menuitem');
      });

      // The whole point of clrDgColumnAction over a plain button: ClrDropdownMenu collects its items
      // through @ContentChildren, which never sees projected content, so the directive has to hand
      // itself to the dropdown's focus handler to take part in arrow key navigation.
      it('joins a projected action to the arrow key order', function () {
        openMenu();

        expect(itemLabelled('Custom').getAttribute('tabindex')).toBe('-1');
        expect(itemLabelled('Custom').getAttribute('id')).toBeTruthy();
      });

      // clr-dropdown-menu is opened with [clrCloseMenuOnItemClick]="false", so a built-in item like
      // Sort Ascending does not close the menu either. closeMenu() checks the same isMenuClosable flag
      // clrDropdownItem does, so a projected action follows suit rather than closing on its own.
      it('leaves the menu open when a projected action is picked', function () {
        openMenu();
        expect(menuItems().length).toBeGreaterThan(0);

        itemLabelled('Custom').click();
        context.detectChanges();

        expect(element.querySelector(TOGGLE).getAttribute('aria-expanded')).toBe('true');
      });

      it('marks a disabled projected action and leaves the menu open', function () {
        context.testComponent.customDisabled = true;
        context.detectChanges();

        openMenu();

        const custom = itemLabelled('Custom');
        expect(custom.classList).toContain('disabled');
        expect(custom.getAttribute('aria-disabled')).toBe('true');

        custom.click();
        context.detectChanges();

        expect(element.querySelector(TOGGLE).getAttribute('aria-expanded')).toBe('true');
      });
    });

    describe('actions', function () {
      let context: TestContext<ClrDatagrid, ColumnActionsTest>;
      let element: HTMLElement;
      let commonStrings: ClrCommonStringsService;

      // The trigger toggles, so opening has to be conditional. Several tests open the menu, act on an
      // item and then want it open again, and an unconditional click would close it instead.
      function openMenu() {
        if (!menuIsOpen()) {
          element.querySelector<HTMLButtonElement>(TOGGLE).click();
          context.detectChanges();
        }
      }

      function closeMenu() {
        if (menuIsOpen()) {
          element.querySelector<HTMLButtonElement>(TOGGLE).click();
          context.detectChanges();
        }
      }

      function invoke(label: string) {
        openMenu();
        itemLabelled(label).click();
        context.detectChanges();
        // clrDropdownItem closes the menu in a setTimeout, which a synchronous test never reaches, so
        // the next invoke() would otherwise start from an already open menu.
        closeMenu();
      }

      beforeEach(function () {
        context = this.create(ClrDatagrid, ColumnActionsTest);
        element = context.clarityElement;
        commonStrings = new ClrCommonStringsService();
      });

      afterEach(function () {
        closeMenu();
      });

      it('sorts ascending and descending', function () {
        const column = context.clarityDirective.columns.first;

        invoke(commonStrings.keys.sortColumnAscending);
        expect(column.sortOrder).toBe(ClrDatagridSortOrder.ASC);

        invoke(commonStrings.keys.sortColumnDescending);
        expect(column.sortOrder).toBe(ClrDatagridSortOrder.DESC);
      });

      it('re-selecting the active direction keeps it, rather than cycling to unsorted', function () {
        const column = context.clarityDirective.columns.first;

        invoke(commonStrings.keys.sortColumnAscending);
        invoke(commonStrings.keys.sortColumnAscending);

        expect(column.sortOrder).toBe(ClrDatagridSortOrder.ASC);
      });

      it('clears the sort', function () {
        const column = context.clarityDirective.columns.first;

        invoke(commonStrings.keys.sortColumnAscending);
        expect(column.sortOrder).toBe(ClrDatagridSortOrder.ASC);

        invoke(commonStrings.keys.clearColumnSort);
        expect(column.sortOrder).toBe(ClrDatagridSortOrder.UNSORTED);
      });

      it('marks the active sort direction', function () {
        invoke(commonStrings.keys.sortColumnAscending);
        openMenu();

        expect(itemLabelled(commonStrings.keys.sortColumnAscending).classList).toContain('active');
        expect(itemLabelled(commonStrings.keys.sortColumnDescending).classList).not.toContain('active');
      });

      it('pins and unpins the column', function () {
        expect(columnTitles(element, HEADER_PINNED)).toEqual([]);

        invoke(commonStrings.keys.pinColumn);
        expect(columnTitles(element, HEADER_PINNED)).toEqual(['First']);

        invoke(commonStrings.keys.unpinColumn);
        expect(columnTitles(element, HEADER_PINNED)).toEqual([]);
      });

      it('writes the new pinned state back through the two-way binding', function () {
        invoke(commonStrings.keys.pinColumn);
        expect(context.testComponent.firstPinned).toBeTrue();

        invoke(commonStrings.keys.unpinColumn);
        expect(context.testComponent.firstPinned).toBeFalse();
      });

      it('follows the binding when the application pins the column itself', function () {
        context.testComponent.firstPinned = true;
        context.detectChanges();

        openMenu();

        expect(menuItemLabels()).toContain(commonStrings.keys.unpinColumn);
        expect(columnTitles(element, HEADER_PINNED)).toEqual(['First']);
      });

      it('does not sort the column when the pin action is used', function () {
        const column = context.clarityDirective.columns.first;
        expect(column.sortable).toBeTrue();

        invoke(commonStrings.keys.pinColumn);

        expect(column.sortOrder).toBe(ClrDatagridSortOrder.UNSORTED);
      });
    });

    describe('filter integration', function () {
      let context: TestContext<ClrDatagrid, AutoFilterTest>;
      let element: HTMLElement;
      let commonStrings: ClrCommonStringsService;

      // The trigger toggles, so opening has to be conditional. Several tests open the menu, act on an
      // item and then want it open again, and an unconditional click would close it instead.
      function openMenu() {
        if (!menuIsOpen()) {
          element.querySelector<HTMLButtonElement>(TOGGLE).click();
          context.detectChanges();
        }
      }

      function closeMenu() {
        if (menuIsOpen()) {
          element.querySelector<HTMLButtonElement>(TOGGLE).click();
          context.detectChanges();
        }
      }

      function filterPanel(): HTMLElement {
        return document.querySelector('.datagrid-filter');
      }

      beforeEach(function () {
        context = this.create(ClrDatagrid, AutoFilterTest);
        element = context.clarityElement;
        commonStrings = new ClrCommonStringsService();
      });

      afterEach(function () {
        // Both overlays live outside the fixture, so neither may leak into the next test.
        if (filterPanel()) {
          document.body.click();
          context.detectChanges();
        }
        closeMenu();
      });

      it('hides the filter toggle on a column that has the menu, and keeps it on one that does not', function () {
        const columns = queryAll(element, '.datagrid-header clr-dg-column');

        expect(columns[0].querySelector('.datagrid-filter-toggle')).toBeNull();
        expect(columns[1].querySelector('.datagrid-filter-toggle')).not.toBeNull();
      });

      it('offers the filter action for a column that has a filter', function () {
        openMenu();

        expect(menuItemLabels()).toContain(commonStrings.keys.filterColumn);
      });

      // The click that opens the popover is also an outside click as far as the popover is concerned.
      // ClrPopoverService.openEvent is what makes it ignore that one event, so this is the regression
      // test for the filter opening and instantly closing again.
      it('opens the filter and leaves it open', function () {
        openMenu();
        itemLabelled(commonStrings.keys.filterColumn).click();
        context.detectChanges();

        expect(filterPanel()).not.toBeNull();
      });

      it('anchors the filter popover to the filter menu item rather than the removed toggle', function () {
        // The column owns the popover service its filter uses, so this is the anchor the filter
        // popover positions against.
        const popover = context.fixture.debugElement
          .query(By.directive(ClrDatagridColumn))
          .injector.get(ClrPopoverService);

        openMenu();
        const filterItem = itemLabelled(commonStrings.keys.filterColumn);
        filterItem.click();
        context.detectChanges();

        expect(popover.originElement.nativeElement).toBe(filterItem);
      });

      // The menu and the filter are two separate overlays, so nothing structurally stops both being
      // open at once. Clicking the trigger is an outside click for the filter, which is what keeps
      // them from overlapping.
      it('dismisses the filter when the menu is opened again', function () {
        openMenu();
        itemLabelled(commonStrings.keys.filterColumn).click();
        context.detectChanges();
        expect(filterPanel()).not.toBeNull();

        // clrDropdownItem closes the menu on a timer that a synchronous test never reaches, so the
        // menu is still open here where the user would find it closed. Closing and reopening covers
        // the same ground: the trigger click is the outside click that dismisses the filter.
        closeMenu();
        openMenu();

        expect(filterPanel()).toBeNull();
        expect(menuIsOpen()).toBeTrue();
      });

      // Mirrors the real interaction: the value is typed into the input inside the filter popover, and
      // then nothing forces a full change detection pass. An explicit fixture.detectChanges() would
      // check every view and hide the bug this guards against - the trigger updating only on the next
      // unrelated interaction.
      it('marks the trigger as soon as a value is typed into the filter', async () => {
        openMenu();
        itemLabelled(commonStrings.keys.filterColumn).click();
        context.detectChanges();

        // autoDetectChanges leaves refreshing to Angular's scheduler, the way the running app does.
        // Calling fixture.detectChanges() by hand would check every view and hide the bug this
        // guards against: the trigger keeping a stale icon until an unrelated interaction.
        context.fixture.autoDetectChanges(true);

        const input: HTMLInputElement = filterPanel().querySelector('input');
        input.value = 'aaa';
        input.dispatchEvent(new Event('input'));
        await context.fixture.whenStable();

        expect(element.querySelector(TOGGLE).classList).toContain('datagrid-column-actions-filtered');
      });

      it('marks the trigger and the action once the column is filtered', function () {
        const filter: any = context.clarityDirective.columns.first.filter;
        filter.value = 'aaa';
        context.detectChanges();

        expect(element.querySelector(TOGGLE).classList).toContain('datagrid-column-actions-filtered');

        openMenu();
        expect(itemLabelled(commonStrings.keys.filterColumn).classList).toContain('active');
      });
    });

    describe('filter integration without a filter', function () {
      let context: TestContext<ClrDatagrid, NoFilterTest>;
      let element: HTMLElement;

      function closeMenu() {
        if (menuIsOpen()) {
          element.querySelector<HTMLButtonElement>(TOGGLE).click();
          context.detectChanges();
        }
      }

      beforeEach(function () {
        context = this.create(ClrDatagrid, NoFilterTest);
        element = context.clarityElement;
      });

      afterEach(function () {
        closeMenu();
      });

      it('omits the filter action when the column has no filter', function () {
        element.querySelector<HTMLButtonElement>(TOGGLE).click();
        context.detectChanges();

        expect(menuItemLabels()).not.toContain(new ClrCommonStringsService().keys.filterColumn);
      });
    });

    describe('clrDgKeepFilterInHeader', function () {
      let context: TestContext<ClrDatagrid, KeepFilterInHeaderTest>;
      let element: HTMLElement;
      let commonStrings: ClrCommonStringsService;

      function openMenu() {
        if (!menuIsOpen()) {
          element.querySelector<HTMLButtonElement>(TOGGLE).click();
          context.detectChanges();
        }
      }

      function closeMenu() {
        if (menuIsOpen()) {
          element.querySelector<HTMLButtonElement>(TOGGLE).click();
          context.detectChanges();
        }
      }

      beforeEach(function () {
        context = this.create(ClrDatagrid, KeepFilterInHeaderTest);
        element = context.clarityElement;
        commonStrings = new ClrCommonStringsService();
      });

      afterEach(function () {
        closeMenu();
      });

      it('keeps the filter toggle in the header instead of moving it into the menu', function () {
        expect(element.querySelector('.datagrid-header .datagrid-filter-toggle')).not.toBeNull();
      });

      // The column title stays sortable alongside the sort actions in the menu, and the filter
      // toggle staying put follows the same dual-access pattern.
      it('still offers the filter action in the menu', function () {
        openMenu();

        expect(menuItemLabels()).toContain(commonStrings.keys.filterColumn);
      });

      it('moves the filter into the menu once the input is turned off', function () {
        context.testComponent.keepInHeader = false;
        context.detectChanges();

        expect(element.querySelector('.datagrid-header .datagrid-filter-toggle')).toBeNull();
      });

      it('moves the filter back into the header when the input is turned on again', function () {
        context.testComponent.keepInHeader = false;
        context.detectChanges();
        context.testComponent.keepInHeader = true;
        context.detectChanges();

        expect(element.querySelector('.datagrid-header .datagrid-filter-toggle')).not.toBeNull();
      });
    });
  });
}

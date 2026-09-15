/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ApplicationRef, Component, getDebugNode } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClrPopoverService } from '@clr/angular/popover/common';
import { ClrDropdown, ClrDropdownItem } from '@clr/angular/popover/dropdown';
import { TestContext } from '@clr/angular/testing';
import { ClrCommonStringsService } from '@clr/angular/utils';

import { ClrDatagrid } from './datagrid';
import { ClrDatagridColumn } from './datagrid-column';
import { ClrDatagridColumnAction } from './datagrid-column-action';
import { ClrDatagridColumnActions } from './datagrid-column-actions';
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

// clrDropdownItem closes the menu from a zero delay timeout, so a test has to let that run. A
// longer wait covers the popover's IntersectionObserver, which reports a frame later.
function settle(ms = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
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
          <button type="button" clrDgColumnAction [clrCloseMenuOnClick]="false" class="sticky-action">Sticky</button>
          <button type="button" clrDropdownItem class="plain-action">Plain</button>
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

      // The menu never offers a dead option, so Clear Sort is absent until there is a sort to clear
      // rather than sitting there disabled.
      it('offers clearing the sort only once the column is sorted', function () {
        openMenu();
        expect(menuItemLabels()).not.toContain(commonStrings.keys.clearColumnSort);

        itemLabelled(commonStrings.keys.sortColumnAscending).click();
        context.detectChanges();

        openMenu();
        expect(menuItemLabels()).toContain(commonStrings.keys.clearColumnSort);
      });

      it('never offers clearing the sort when the column disabled unsorting', function () {
        context.testComponent.disableUnsort = true;
        context.detectChanges();

        openMenu();
        itemLabelled(commonStrings.keys.sortColumnAscending).click();
        context.detectChanges();

        openMenu();
        expect(menuItemLabels()).not.toContain(commonStrings.keys.clearColumnSort);
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
        expect(labels.slice(-3)).toEqual(['Custom', 'Sticky', 'Plain']);
      });

      it('styles a projected action as a menu item', function () {
        openMenu();

        const custom = itemLabelled('Custom');
        expect(custom.classList).toContain('dropdown-item');
        expect(custom.getAttribute('role')).toBe('menuitem');
      });

      // ClrDropdownMenu collects its items through @ContentChildren, which never sees projected
      // content, so the component gathers the projected ones itself and hands them to the dropdown's
      // focus handler to take part in arrow key navigation.
      it('joins a projected action to the arrow key order', function () {
        openMenu();

        expect(itemLabelled('Custom').getAttribute('tabindex')).toBe('-1');
        expect(itemLabelled('Custom').getAttribute('id')).toBeTruthy();
        // A plain clrDropdownItem is projected the same way.
        expect(itemLabelled('Plain').getAttribute('tabindex')).toBe('-1');
      });

      // What lets clrDgColumnAction be a clrDropdownItem at all. A projected item is declared outside
      // this component, so it can only resolve ClrDropdown because the component is the dropdown and
      // provides itself under that token - a clr-dropdown inside its template would be out of reach.
      it('is the dropdown a projected action injects', function () {
        // The item is only rendered while the menu is open, and then it sits in the overlay rather
        // than in the fixture, which is why it is reached through its element.
        openMenu();

        const actions = context.fixture.debugElement.query(By.directive(ClrDatagridColumnActions));
        const action = getDebugNode(document.querySelector('.custom-action'));

        expect(action.injector.get(ClrDatagridColumnAction)).toBeInstanceOf(ClrDropdownItem);
        expect(action.injector.get(ClrDropdown)).toBe(actions.componentInstance);
        expect(actions.injector.get(ClrDropdown)).toBe(actions.componentInstance);
        expect(actions.nativeElement.classList).toContain('dropdown');
      });

      // The menu is anchored with its own popover service; the column's, which its filter uses, is a
      // different one. Being the dropdown is what brings the second service - without it the menu
      // would be driving the same overlay as the filter.
      it('keeps the menu overlay apart from the column one', function () {
        const actions = context.fixture.debugElement.query(By.directive(ClrDatagridColumnActions));
        const column = context.fixture.debugElement.query(By.directive(ClrDatagridColumn));

        expect(actions.injector.get(ClrPopoverService)).not.toBe(column.injector.get(ClrPopoverService));
        expect(actions.injector.get(ClrPopoverService)).toBe(actions.componentInstance.popoverService);
      });

      // clrDgColumnAction is a clrDropdownItem, so it has to be its own focusable item rather than
      // resolving the menu's focus handler through the FocusableItem token.
      it('gives each projected action its own id', function () {
        openMenu();

        const ids = ['Custom', 'Sticky', 'Plain'].map(label => itemLabelled(label).getAttribute('id'));
        expect(new Set(ids).size).toBe(3);
      });

      // clrDgColumnAction is a clrDropdownItem, so it closes the menu on click the way any dropdown
      // item does - on a timer, after the application's own click handler has run.
      it('closes the menu when a projected action is picked', async () => {
        openMenu();
        expect(menuItems().length).toBeGreaterThan(0);

        itemLabelled('Custom').click();
        context.detectChanges();
        await settle();
        context.detectChanges();

        expect(menuIsOpen()).toBeFalse();
        expect(element.querySelector(TOGGLE).getAttribute('aria-expanded')).toBe('false');
      });

      // An action that moves the column it belongs to opts out per item, the way the built-in pin
      // action does, so the menu can be re-anchored rather than closed.
      it('leaves the menu open for an item with clrCloseMenuOnClick false', async () => {
        openMenu();

        itemLabelled('Sticky').click();
        context.detectChanges();
        await settle();
        context.detectChanges();

        expect(menuIsOpen()).toBeTrue();
      });

      // The one thing clrDgColumnAction adds over clrDropdownItem: an item that keeps the menu open
      // is assumed to have moved the column, so the menu is re-anchored to the trigger.
      it('re-anchors the menu after an action that keeps it open', function () {
        const columnActions: ClrDatagridColumnActions = context.fixture.debugElement.query(
          By.directive(ClrDatagridColumnActions)
        ).componentInstance;
        const repositionMenu = spyOn(columnActions, 'repositionMenu').and.callThrough();

        openMenu();
        itemLabelled('Sticky').click();
        context.detectChanges();
        expect(repositionMenu).toHaveBeenCalledTimes(1);

        itemLabelled('Custom').click();
        context.detectChanges();
        expect(repositionMenu).toHaveBeenCalledTimes(1);
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
        // clrDropdownItem closes the menu in a setTimeout, which a synchronous test never reaches, and
        // the pin item keeps it open on purpose, so the next invoke() would otherwise start from an
        // already open menu.
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

      // The component is OnPush and declared in the application's view, so a sort that arrives
      // through the column rather than through this menu has to be reported to it explicitly.
      it('follows a sort applied from outside while the menu is open', function () {
        openMenu();
        expect(itemLabelled(commonStrings.keys.clearColumnSort)).toBeUndefined();

        context.clarityDirective.columns.first.sort();
        context.detectChanges();

        expect(itemLabelled(commonStrings.keys.sortColumnAscending).classList).toContain('active');
        expect(itemLabelled(commonStrings.keys.sortColumnAscending).getAttribute('aria-checked')).toBe('true');
        expect(itemLabelled(commonStrings.keys.clearColumnSort)).toBeDefined();
      });

      it('follows a pin applied from outside while the menu is open', function () {
        openMenu();
        expect(itemLabelled(commonStrings.keys.unpinColumn)).toBeUndefined();

        context.clarityDirective.columns.first.togglePinned();
        context.detectChanges();

        expect(itemLabelled(commonStrings.keys.unpinColumn)).toBeDefined();
      });

      // The class is visual only. The two directions are exclusive settings, so they are radio
      // menu items whose checked state a screen reader can announce.
      it('announces the sort direction as a checked radio menu item', function () {
        openMenu();
        const ascending = () => itemLabelled(commonStrings.keys.sortColumnAscending);
        const descending = () => itemLabelled(commonStrings.keys.sortColumnDescending);
        expect(ascending().getAttribute('role')).toBe('menuitemradio');
        expect(ascending().getAttribute('aria-checked')).toBe('false');
        expect(descending().getAttribute('aria-checked')).toBe('false');
        closeMenu();

        invoke(commonStrings.keys.sortColumnDescending);
        openMenu();
        expect(ascending().getAttribute('aria-checked')).toBe('false');
        expect(descending().getAttribute('aria-checked')).toBe('true');
      });

      // The checkable role belongs to the sort items alone - everything else in the menu performs an
      // action rather than reporting a setting, so it keeps the plain menuitem role.
      it('leaves the remaining items as plain menu items', function () {
        openMenu();

        expect(itemLabelled(commonStrings.keys.pinColumn).getAttribute('role')).toBe('menuitem');
        expect(itemLabelled(commonStrings.keys.pinColumn).getAttribute('aria-checked')).toBeNull();
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

      // Pinning moves the column into the static container, so the trigger this menu is anchored to
      // travels with it. The menu is deliberately left open - the action it now offers is the one
      // that undoes the pin - so it has to be re-anchored rather than left hanging next to where the
      // column used to be. The relocation happens on the render cycle the pin schedules, which is
      // why the hook runs after it rather than during the click.
      it('re-anchors the open menu after pinning moves the column', function () {
        // The component is the dropdown, so the menu's popover service is its own.
        const popoverService = context.fixture.debugElement
          .query(By.directive(ClrDatagridColumnActions))
          .injector.get(ClrPopoverService);
        const updatePosition = spyOn(popoverService, 'updatePosition').and.callThrough();

        openMenu();
        itemLabelled(commonStrings.keys.pinColumn).click();
        context.detectChanges();
        TestBed.inject(ApplicationRef).tick();

        expect(columnTitles(element, HEADER_PINNED)).toEqual(['First']);
        expect(updatePosition).toHaveBeenCalled();
        expect(menuItemLabels()).toContain(commonStrings.keys.unpinColumn);
      });

      // The popover watches its origin with an IntersectionObserver, and a node that is moved in the
      // DOM is reported as not intersecting once, although it is visible again by the next frame.
      // Pinning moves the column, so without a second look the menu closed a frame after it had been
      // re-anchored - which a synchronous test never sees.
      it('keeps the menu open once the observer has reported on the moved trigger', async () => {
        openMenu();
        await settle(30);
        context.detectChanges();

        itemLabelled(commonStrings.keys.pinColumn).click();
        context.detectChanges();
        await settle(80);
        context.detectChanges();

        expect(columnTitles(element, HEADER_PINNED)).toEqual(['First']);
        expect(menuIsOpen()).toBeTrue();
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

      // The menu item that opens the filter is gone as soon as the menu closes, so the filter is
      // anchored to the kebab in the header instead - the one element that stays put.
      it('anchors the filter popover to the trigger rather than to the menu item', function () {
        // The column owns the popover service its filter uses, so this is the anchor the filter
        // popover positions against.
        const popover = context.fixture.debugElement
          .query(By.directive(ClrDatagridColumn))
          .injector.get(ClrPopoverService);

        openMenu();
        itemLabelled(commonStrings.keys.filterColumn).click();
        context.detectChanges();

        expect(popover.originElement.nativeElement).toBe(element.querySelector<HTMLElement>(TOGGLE));
      });

      it('announces the dialog the filter action opens', function () {
        openMenu();
        const filterItem = itemLabelled(commonStrings.keys.filterColumn);
        expect(filterItem.getAttribute('aria-haspopup')).toBe('dialog');
        expect(filterItem.getAttribute('aria-expanded')).toBe('false');
        expect(filterItem.getAttribute('aria-controls')).toBeTruthy();

        filterItem.click();
        context.detectChanges();

        expect(filterPanel().id).toBe(filterItem.getAttribute('aria-controls'));
        expect(filterItem.getAttribute('aria-expanded')).toBe('true');
      });

      // The filter is closed by an outside click or an escape key, neither of which goes through this
      // template, and the menu is OnPush - so without being told, the item would be left announcing
      // itself as expanded over a filter that is gone. Closing through the service is that path: it is
      // what both of those gestures end up doing.
      it('reports the filter closed again when it is dismissed from the outside', function () {
        const popover = context.fixture.debugElement
          .query(By.directive(ClrDatagridColumn))
          .injector.get(ClrPopoverService);

        openMenu();
        const filterItem = itemLabelled(commonStrings.keys.filterColumn);
        filterItem.click();
        context.detectChanges();
        expect(filterItem.getAttribute('aria-expanded')).toBe('true');

        popover.open = false;
        context.detectChanges();

        expect(filterItem.getAttribute('aria-expanded')).toBe('false');
      });

      it('closes the menu once the filter is open', async () => {
        openMenu();
        itemLabelled(commonStrings.keys.filterColumn).click();
        context.detectChanges();
        await settle();
        context.detectChanges();

        expect(filterPanel()).not.toBeNull();
        expect(menuIsOpen()).toBeFalse();
      });

      // With the filter anchored to a menu item, closing the menu detached that item and the
      // filter's observer then closed the filter as well; a scroll did exactly that.
      it('keeps the filter open when the page scrolls', async () => {
        openMenu();
        itemLabelled(commonStrings.keys.filterColumn).click();
        context.detectChanges();
        await settle(30);

        document.dispatchEvent(new Event('scroll'));
        context.detectChanges();
        await settle(250);

        expect(filterPanel()).not.toBeNull();
      });

      it('returns focus to the trigger when the filter is closed', async () => {
        openMenu();
        itemLabelled(commonStrings.keys.filterColumn).click();
        context.detectChanges();
        await settle(30);

        filterPanel().querySelector<HTMLButtonElement>('.close').click();
        context.detectChanges();

        expect(filterPanel()).toBeNull();
        expect(document.activeElement).toBe(element.querySelector(TOGGLE));
      });

      // The menu and the filter are two separate overlays, so nothing structurally stops both being
      // open at once. Clicking the trigger is an outside click for the filter, which is what keeps
      // them from overlapping.
      it('dismisses the filter when the menu is opened again', function () {
        openMenu();
        itemLabelled(commonStrings.keys.filterColumn).click();
        context.detectChanges();
        expect(filterPanel()).not.toBeNull();

        // The filter item closes the menu on a timer that a synchronous test never reaches, so the
        // menu is still open here. Closing and reopening covers the same ground: the trigger click is
        // the outside click that dismisses the filter.
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

      // The filter item itself carries no highlight: the trigger is what shows the filtered state,
      // through its class and the icon it switches to.
      it('marks the trigger once the column is filtered', function () {
        const filter: any = context.clarityDirective.columns.first.filter;
        filter.value = 'aaa';
        context.detectChanges();

        expect(element.querySelector(TOGGLE).classList).toContain('datagrid-column-actions-filtered');
        expect(element.querySelector(TOGGLE + ' cds-icon').getAttribute('shape')).toBe('ellipsis-grid-circle');

        openMenu();
        expect(itemLabelled(commonStrings.keys.filterColumn).classList).not.toContain('active');

        const filterIcon = itemLabelled(commonStrings.keys.filterColumn)?.querySelector('cds-icon');
        expect(filterIcon.getAttribute('shape')).toContain('filter-grid-circle');
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

      // A column offers one way to reach its filter at a time, so the menu gives the filter action up
      // in exchange for the toggle staying in the header.
      it('drops the filter action from the menu', function () {
        openMenu();

        expect(menuItemLabels()).not.toContain(commonStrings.keys.filterColumn);
      });

      it('offers the filter action in the menu once the input is turned off', function () {
        context.testComponent.keepInHeader = false;
        context.detectChanges();

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

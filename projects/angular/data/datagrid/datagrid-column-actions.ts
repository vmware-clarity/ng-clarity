/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  Optional,
  ViewChild,
} from '@angular/core';
import { ClrPopoverService } from '@clr/angular/popover/common';
import { ClrDropdown, ClrDropdownMenu } from '@clr/angular/popover/dropdown';
import { ClrCommonStringsService, FocusableItem } from '@clr/angular/utils';
import { Subscription } from 'rxjs';

import { ClrDatagridColumn } from './datagrid-column';
import { ClrDatagridSortOrder } from './enums/sort-order.enum';
import { ColumnActionsService } from './providers/column-actions.service';
import { FiltersProvider } from './providers/filters';
import { KeyNavigationGridController } from './utils/key-navigation-grid.controller';

/**
 * Groups the actions of a single column behind one menu in the column header. It only gathers
 * controls that already exist on the column - the behavior itself stays on `ClrDatagridColumn`,
 * so the menu and the header controls can never drift apart.
 *
 * Each item is rendered only when the column can actually perform it, so the menu never offers a
 * dead option. Anything projected into the component is appended after the built-in items.
 *
 * A column that has a filter gets a filter action automatically, and the filter drops its own toggle
 * for as long as this menu is present - the header keeps one control per column rather than two. The
 * trigger also takes over showing that the column is filtered, which the toggle used to do.
 *
 * Projected items should carry `clrDgColumnAction`, which registers them here so they join the
 * arrow key order and close the menu when picked. `clrDropdownItem` cannot be used from the outside -
 * see `ClrDatagridColumnAction` for why.
 */
@Component({
  selector: 'clr-dg-column-actions',
  template: `
    <clr-dropdown>
      <button
        class="datagrid-column-actions-toggle"
        type="button"
        clrDropdownTrigger
        #trigger
        [class.datagrid-column-actions-filtered]="filterActive"
        [attr.aria-label]="triggerLabel"
      >
        <cds-icon shape="ellipsis-vertical" size="14" [badge]="filterActive ? 'info' : null" aria-hidden="true" />
      </button>

      <clr-dropdown-menu *clrIfOpen clrPosition="bottom-right">
        @if (column.sortable) {
          <button
            type="button"
            clrDropdownItem
            [class.active]="sortOrder === ClrDatagridSortOrder.ASC"
            (click)="sort(false)"
          >
            <cds-icon shape="arrow" direction="up" aria-hidden="true"></cds-icon>
            {{ commonStrings.keys.sortColumnAscending }}
          </button>
          <button
            type="button"
            clrDropdownItem
            [class.active]="sortOrder === ClrDatagridSortOrder.DESC"
            (click)="sort(true)"
          >
            <cds-icon shape="arrow" direction="down" aria-hidden="true"></cds-icon>
            {{ commonStrings.keys.sortColumnDescending }}
          </button>
          @if (!column.disableUnsort) {
            <button type="button" clrDropdownItem [disabled]="canClearSort ? null : true" (click)="column.clearSort()">
              <cds-icon shape="times" aria-hidden="true"></cds-icon>
              {{ commonStrings.keys.clearColumnSort }}
            </button>
          }
        }

        @if (column.pinnable) {
          @if (column.sortable) {
            <div class="dropdown-divider" role="separator"></div>
          }
          <button type="button" clrDropdownItem (click)="column.togglePinned()">
            <cds-icon [shape]="column.pinned ? 'unpin' : 'pin'" solid aria-hidden="true"></cds-icon>
            {{ column.pinned ? commonStrings.keys.unpinColumn : commonStrings.keys.pinColumn }}
          </button>
        }

        @if (hasFilter) {
          @if (column.sortable || column.pinnable) {
            <div class="dropdown-divider" role="separator"></div>
          }
          <button type="button" clrDropdownItem [class.active]="filterActive" (click)="openFilter($event)">
            <cds-icon [shape]="filterActive ? 'filter-grid-circle' : 'filter-grid'" solid aria-hidden="true"></cds-icon>
            {{ commonStrings.keys.filterColumn }}
          </button>
        }

        <ng-content></ng-content>
      </clr-dropdown-menu>
    </clr-dropdown>
  `,
  host: {
    '[class.datagrid-column-actions]': 'true',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ClrDatagridColumnActions implements AfterViewInit, OnDestroy {
  // Exposed so the template can compare against the enum.
  protected readonly ClrDatagridSortOrder = ClrDatagridSortOrder;

  @ViewChild('trigger', { read: ElementRef }) private trigger: ElementRef<HTMLButtonElement>;

  @ViewChild(ClrDropdown) private dropdown: ClrDropdown;

  private menuInstance: ClrDropdownMenu;

  private subscriptions: Subscription[] = [];
  private menuItemsSubscription: Subscription;
  private projectedActions: FocusableItem[] = [];
  private viewReady = false;

  constructor(
    protected column: ClrDatagridColumn,
    protected commonStrings: ClrCommonStringsService,
    private columnActions: ColumnActionsService,
    // The column's own popover service, shared with its filter. The clr-dropdown in this template
    // brings its own, so the menu and the filter never fight over one overlay.
    private columnPopover: ClrPopoverService,
    private changeDetectorRef: ChangeDetectorRef,
    @Optional() private keyNavigation: KeyNavigationGridController,
    @Optional() private filters: FiltersProvider
  ) {
    // Tells the filter to drop its own toggle - from here on this menu is the only way to open it.
    columnActions.present.set(true);
  }

  /**
   * The menu is a live view of the column, so the label has to be read at render time rather than
   * cached - the column title can change, and so can the sort state it reports.
   */
  protected get triggerLabel(): string {
    const title = this.column.titleContainer?.nativeElement.textContent.trim();

    return title
      ? this.commonStrings.parse(this.commonStrings.keys.datagridColumnActionsAriaLabel, { COLUMN: title })
      : this.commonStrings.keys.columnActions;
  }

  protected get sortOrder(): ClrDatagridSortOrder {
    return this.column.sortOrder;
  }

  protected get canClearSort(): boolean {
    return this.sortOrder !== ClrDatagridSortOrder.UNSORTED;
  }

  protected get hasFilter(): boolean {
    return !!this.columnActions.filter();
  }

  /**
   * Hiding the filter toggle also hides the only sign that a column is filtered, so the trigger and
   * the filter action carry that state instead.
   */
  protected get filterActive(): boolean {
    return !!this.columnActions.filter()?.active;
  }

  /**
   * clrIfOpen destroys the menu on close and builds a fresh one on open, so this runs with a new
   * instance every time and its items have to be picked up again.
   *
   * A setter rather than the clrIfOpenChange output: that output fires the moment ClrIfOpen creates
   * the view, which is before Angular refreshes this query, so the instance is not reachable from it
   * yet. A query setter runs exactly when the result changes.
   *
   * ClrDropdownMenu registers only the items declared in this template, and re-registers them
   * whenever they change, so the full list including the projected ones has to be applied after it.
   */
  @ViewChild(ClrDropdownMenu)
  private set menu(menu: ClrDropdownMenu) {
    this.menuInstance = menu;
    this.menuItemsSubscription?.unsubscribe();

    if (menu) {
      this.menuItemsSubscription = menu.items.changes.subscribe(() => this.linkMenuItems());
    }

    this.linkMenuItems();
  }

  ngAfterViewInit() {
    // The grid owns arrow key handling for the header, so it has to stand down while either overlay
    // has focus - the menu, or the filter this menu opens. ClrDatagridFilter normally does the second
    // half itself, but only when it is opened through its own input, which is no longer the path.
    if (this.keyNavigation) {
      this.subscriptions.push(
        this.dropdown.popoverService.openChange.subscribe(() => this.updateSkipItemFocus()),
        this.columnPopover.openChange.subscribe(() => this.updateSkipItemFocus())
      );
    }

    // The trigger and the filter action show whether the column is filtered, and this component is
    // OnPush, so it has to be told when a filter value changes.
    if (this.filters) {
      this.subscriptions.push(this.filters.change.subscribe(() => this.changeDetectorRef.markForCheck()));
    }

    // The menu is rebuilt on every open, and clrIfOpenChange is what reports that.
    this.viewReady = true;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.menuItemsSubscription?.unsubscribe();
    // Hands the filter back its own toggle, in case the menu is removed while the column stays.
    this.columnActions.present.set(false);
  }

  /**
   * Called by the projected `clrDgColumnAction` items, which cannot reach the dropdown themselves.
   */
  registerAction(item: FocusableItem) {
    this.projectedActions.push(item);
    this.linkMenuItems();
  }

  unregisterAction(item: FocusableItem) {
    const index = this.projectedActions.indexOf(item);

    if (index > -1) {
      this.projectedActions.splice(index, 1);
      this.linkMenuItems();
    }
  }

  /**
   * Returns focus to the trigger before closing, the same order `clrDropdownItem` uses - moving focus
   * first means it lands correctly even when the action opens a modal.
   */
  closeMenu() {
    this.dropdown.focusHandler.focus();
    this.dropdown.popoverService.open = false;
  }

  /**
   * The menu states a direction rather than cycling through them, so asking for the direction the
   * column already has is a no-op.
   *
   * The guard is needed because `Sort.toggle()` reads `forceReverse: false` as "toggle" rather than
   * "ascending" - `forceReverse || !this._reverse` falls through to the toggle for a falsy value - so
   * `sort(false)` on an already ascending column would flip it to descending. The tri-state title
   * button never hits that path, because it always calls `sort()` without an argument.
   */
  protected sort(descending: boolean) {
    const requested = descending ? ClrDatagridSortOrder.DESC : ClrDatagridSortOrder.ASC;

    if (this.sortOrder !== requested) {
      this.column.sort(descending);
    }
  }

  /**
   * Opens the filter of this column, anchored to the menu trigger.
   *
   * The popover is driven through the column's ClrPopoverService rather than through
   * `ClrDatagridFilter.open`, because that is the one thing every filter flavour has in common - a
   * projected clr-dg-filter, and the string and numeric filters the column builds for clrDgField,
   * all share this service. Setting `origin` is all it takes to re-anchor it: `clrPopoverOrigin` is
   * itself only an assignment to that property, and with the toggle gone nothing else claims it.
   */
  protected openFilter(event: Event) {
    this.columnPopover.origin = this.trigger;

    // The popover closes on an outside click, and ignores exactly one event while doing so: the one
    // that opened it. Without this, the very click on this menu item would close the filter again.
    this.columnPopover.openEvent = event;
    this.columnPopover.open = true;
  }

  private updateSkipItemFocus() {
    this.keyNavigation.skipItemFocus = this.dropdown.popoverService.open || this.columnPopover.open;
  }

  private linkMenuItems() {
    // The projected items register from their own constructor, which runs while the view is still
    // being created, and the menu itself only exists while it is open.
    if (!this.viewReady || !this.menuInstance) {
      return;
    }

    this.dropdown.focusHandler.addChildren([...this.menuInstance.items.toArray(), ...this.projectedActions]);
  }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterContentInit,
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  forwardRef,
  Injector,
  Input,
  OnDestroy,
  Optional,
  QueryList,
  SkipSelf,
  ViewChild,
} from '@angular/core';
import { ClrPopoverService } from '@clr/angular/popover/common';
import { ClrDropdown, ClrDropdownMenu, DropdownFocusHandler, RootDropdownService } from '@clr/angular/popover/dropdown';
import {
  ClrCommonStringsService,
  customFocusableItemProvider,
  FOCUS_SERVICE_PROVIDER,
  FocusableItem,
} from '@clr/angular/utils';
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
 * dead option - that covers both what the column can never do, such as sorting when it is not
 * sortable, and what it cannot do right now, such as clearing a sort while nothing is sorted.
 * Anything projected into the component is appended after the built-in items.
 *
 * A column that has a filter gets a filter action automatically, and the filter drops its own toggle
 * for as long as this menu is present - the header keeps one control per column rather than two. The
 * trigger also takes over showing that the column is filtered, which the toggle used to do.
 * `clrDgKeepFilterInHeader` opts back into the toggle, and then the menu drops the filter action in
 * exchange: a column offers one way to reach its filter, never both at once.
 *
 * The component is itself the dropdown, rather than wrapping a `clr-dropdown` in its template: it
 * extends `ClrDropdown` and provides itself under that token. That is what lets projected items be
 * plain `clrDropdownItem`s - they resolve the dropdown from where they are declared, and this host
 * is on that path, where an element inside the template would not be.
 */
@Component({
  selector: 'clr-dg-column-actions',
  template: `
    <button
      class="datagrid-column-actions-toggle"
      type="button"
      clrDropdownTrigger
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
        @if (canClearSort) {
          <button type="button" clrDropdownItem (click)="column.clearSort()">
            <cds-icon shape="times" aria-hidden="true"></cds-icon>
            {{ commonStrings.keys.clearColumnSort }}
          </button>
        }
      }

      @if (column.pinnable) {
        @if (column.sortable) {
          <div class="dropdown-divider" role="separator"></div>
        }
        <!-- Stays open on purpose: the action it offers next is the one that undoes the pin. -->
        <button type="button" clrDropdownItem [clrCloseMenuOnClick]="false" (click)="togglePinned()">
          <cds-icon
            [shape]="column.pinned ? 'unpin' : 'pin'"
            solid
            size="12"
            style="margin: 2px;"
            aria-hidden="true"
          ></cds-icon>
          {{ column.pinned ? commonStrings.keys.unpinColumn : commonStrings.keys.pinColumn }}
        </button>
      }

      @if (hasFilter && !keepFilterInHeader) {
        @if (column.sortable || column.pinnable) {
          <div class="dropdown-divider" role="separator"></div>
        }
        <!-- Stays open because the filter popover is anchored to this very item. -->
        <button
          type="button"
          #trigger
          clrDropdownItem
          [clrCloseMenuOnClick]="false"
          [class.active]="filterActive"
          (click)="openFilter($event)"
        >
          <cds-icon [shape]="filterActive ? 'filter-grid-circle' : 'filter-grid'" solid aria-hidden="true"></cds-icon>
          {{ commonStrings.keys.filterColumn }}
        </button>
      }

      <ng-content></ng-content>
    </clr-dropdown-menu>
  `,
  host: {
    '[class.datagrid-column-actions]': 'true',
  },
  // What clr-dropdown provides - providers are not inherited, unlike the ClrPopoverHostDirective
  // host directive, which is - plus this component under the ClrDropdown token so the trigger, the
  // menu and any projected clrDropdownItem all find it. The root dropdown service is provided
  // outright rather than shared with an enclosing dropdown: this menu is always a root of its own.
  providers: [
    RootDropdownService,
    FOCUS_SERVICE_PROVIDER,
    customFocusableItemProvider(DropdownFocusHandler),
    { provide: ClrDropdown, useExisting: forwardRef(() => ClrDatagridColumnActions) },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ClrDatagridColumnActions extends ClrDropdown implements AfterContentInit, OnDestroy {
  // Exposed so the template can compare against the enum.
  protected readonly ClrDatagridSortOrder = ClrDatagridSortOrder;

  private _keepFilterInHeader = false;

  @ViewChild('trigger', { read: ElementRef }) private trigger: ElementRef<HTMLButtonElement>;

  /**
   * The projected items. ClrDropdownMenu only ever sees the items declared in this template, so the
   * projected ones are gathered here and handed to the focus handler along with them.
   */
  @ContentChildren(FocusableItem, { descendants: true }) private projectedItems: QueryList<FocusableItem>;

  private menuInstance: ClrDropdownMenu;

  private columnSubscriptions: Subscription[] = [];
  private menuItemsSubscription: Subscription;
  private isGone = false;

  constructor(
    @SkipSelf() @Optional() parent: ClrDropdown,
    popoverService: ClrPopoverService,
    focusHandler: DropdownFocusHandler,
    private changeDetectorRef: ChangeDetectorRef,
    dropdownService: RootDropdownService,
    protected column: ClrDatagridColumn,
    protected commonStrings: ClrCommonStringsService,
    private columnActions: ColumnActionsService,
    // The column's own popover service, shared with its filter. This host brings its own for the
    // menu, so the menu and the filter never fight over one overlay.
    @SkipSelf() private columnPopover: ClrPopoverService,
    private injector: Injector,
    @Optional() private keyNavigation: KeyNavigationGridController,
    @Optional() private filters: FiltersProvider
  ) {
    super(parent, popoverService, focusHandler, changeDetectorRef, dropdownService);

    // Tells the filter to drop its own toggle - from here on this menu is the only way to open it,
    // unless clrDgKeepFilterInHeader asked to keep both. Reading the backing field rather than the
    // getter covers the default: Angular only invokes the setter above when the input is actually
    // bound, and by then the field initializer has already run.
    columnActions.present.set(!this._keepFilterInHeader);

    // The grid owns arrow key handling for the header, so it has to stand down while either overlay
    // has focus - the menu, or the filter this menu opens. ClrDatagridFilter normally does the second
    // half itself, but only when it is opened through its own input, which is no longer the path.
    if (keyNavigation) {
      this.columnSubscriptions.push(
        popoverService.openChange.subscribe(() => this.updateSkipItemFocus()),
        columnPopover.openChange.subscribe(() => this.updateSkipItemFocus())
      );
    }

    // The trigger and the filter action show whether the column is filtered, and this component is
    // OnPush, so it has to be told when a filter value changes.
    if (filters) {
      this.columnSubscriptions.push(filters.change.subscribe(() => changeDetectorRef.markForCheck()));
    }
  }

  /**
   * Keeps the filter's own toggle in the column header instead of moving it into this menu, and the
   * menu drops its filter action in exchange - a column offers one way to reach its filter at a
   * time, never two.
   */
  @Input({ alias: 'clrDgKeepFilterInHeader', transform: booleanAttribute })
  get keepFilterInHeader(): boolean {
    return this._keepFilterInHeader;
  }
  set keepFilterInHeader(value: boolean) {
    this._keepFilterInHeader = value;
    this.columnActions.present.set(!value);
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
    return this.sortOrder !== ClrDatagridSortOrder.UNSORTED && !this.column.disableUnsort;
  }

  protected get hasFilter(): boolean {
    return !!this.columnActions.filter();
  }

  /**
   * Hiding the filter toggle also hides the only sign that a column is filtered, so the trigger and
   * the filter action carry that state instead.
   */
  protected get filterActive(): boolean {
    return !!this.columnActions.filter()?.active && !this.keepFilterInHeader;
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

  ngAfterContentInit() {
    this.columnSubscriptions.push(this.projectedItems.changes.subscribe(() => this.linkMenuItems()));
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.isGone = true;
    this.columnSubscriptions.forEach(sub => sub.unsubscribe());
    this.menuItemsSubscription?.unsubscribe();
    // Hands the filter back its own toggle, in case the menu is removed while the column stays.
    this.columnActions.present.set(false);
    // The grid's own key handling was told to stand down while the menu was open; nothing else will
    // tell it to resume if the menu is destroyed in that state.
    if (this.keyNavigation) {
      this.keyNavigation.skipItemFocus = false;
    }
  }

  /**
   * Re-anchors the open menu to the trigger, for an action that moves the column it belongs to
   * instead of closing the menu behind it.
   *
   * Deferred to after the next render rather than run straight away, because the action that asked
   * for this has only just been clicked - the column is relocated by the change detection that
   * follows, so measuring the trigger now would re-anchor the menu to where it already is.
   */
  repositionMenu() {
    // An action can take the column, and this menu with it, out of the grid - the column ordering
    // addon rebuilds the column views once a column is pinned. There is nothing left to re-anchor
    // then, and the render hook could not be registered against a torn-down injector anyway.
    if (this.isGone) {
      return;
    }

    afterNextRender(() => this.popoverService.updatePosition(), { injector: this.injector });
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
   * Pins or unpins the column, then re-anchors this menu to the trigger.
   *
   * Pinning moves the column between the datagrid's static and scrollable containers, and the
   * trigger this menu is anchored to travels with it - far enough that the menu would otherwise be
   * left hanging next to where the column used to be. The menu stays open on purpose, so the action
   * it now offers is the one that undoes the pin the user just applied.
   */
  protected togglePinned() {
    this.column.togglePinned();
    this.repositionMenu();
  }

  /**
   * Opens the filter of this column, anchored to the "Filter Column" menu item itself (`#trigger`
   * above), so the popover positions off the item that was actually clicked rather than the kebab.
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
    this.keyNavigation.skipItemFocus = this.popoverService.open || this.columnPopover.open;
  }

  private linkMenuItems() {
    // The menu only exists while it is open.
    if (!this.menuInstance) {
      return;
    }

    this.focusHandler.addChildren([...this.menuInstance.items.toArray(), ...(this.projectedItems?.toArray() ?? [])]);
  }
}

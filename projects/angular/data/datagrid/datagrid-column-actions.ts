/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  afterNextRender,
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injector,
  Input,
  OnDestroy,
  Optional,
  SkipSelf,
  ViewChild,
} from '@angular/core';
import { ClrPopoverService } from '@clr/angular/popover/common';
import {
  ClrDropdown,
  ClrDropdownMenu,
  DROPDOWN_FOCUS_HANDLER_PROVIDER,
  DropdownFocusHandler,
  ROOT_DROPDOWN_PROVIDER,
  RootDropdownService,
} from '@clr/angular/popover/dropdown';
import { ClrCommonStringsService, FOCUS_SERVICE_PROVIDER, FocusableItem } from '@clr/angular/utils';
import { Subscription } from 'rxjs';

import { ClrDatagridColumn } from './datagrid-column';
import { ClrDatagridSortOrder } from './enums/sort-order.enum';
import { ColumnActionsService } from './providers/column-actions.service';
import { FiltersProvider } from './providers/filters';

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
 * Projected items should carry `clrDgColumnAction`, which is the dropdown item with the menu's own
 * registration on top - a plain `clrDropdownItem` is styled and clickable, but the menu cannot find
 * it to put it in the arrow key order.
 *
 * The component is the dropdown itself rather than wrapping one, so that a projected item can reach
 * it: injection resolves from where a node is declared, and an item declared outside this component
 * would sit outside the injector of any `clr-dropdown` in its template.
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
      <cds-icon
        [size]="filterActive ? '16' : '12'"
        [shape]="filterActive ? 'ellipsis-grid-circle' : 'ellipsis-vertical'"
        [status]="filterActive ? 'info' : null"
        aria-hidden="true"
      />
    </button>

    <clr-dropdown-menu *clrIfOpen clrPosition="bottom-right">
      @if (column.sortable) {
        <!--
          The two directions are one exclusive setting rather than two commands, so they are radio
          items: the applied one is then announced as such. The active class alone would leave it
          visible only to a sighted user - the column header's aria-sort is not read from in here.
        -->
        <button
          type="button"
          clrDropdownItem
          role="menuitemradio"
          [attr.aria-checked]="sortOrder === ClrDatagridSortOrder.ASC"
          [class.active]="sortOrder === ClrDatagridSortOrder.ASC"
          (click)="sort(false)"
        >
          <cds-icon shape="arrow" direction="up" aria-hidden="true"></cds-icon>
          {{ commonStrings.keys.sortColumnAscending }}
        </button>
        <button
          type="button"
          clrDropdownItem
          role="menuitemradio"
          [attr.aria-checked]="sortOrder === ClrDatagridSortOrder.DESC"
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
        <button type="button" clrDropdownItem (click)="togglePinned()">
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
        <!--
          This item stands in for the filter's own toggle, so it takes over the state that toggle
          announced: that it opens a dialog, and whether that dialog is open right now.
        -->
        <button
          type="button"
          #trigger
          clrDropdownItem
          aria-haspopup="dialog"
          [attr.aria-expanded]="filterOpen"
          [attr.aria-controls]="filterPopoverId"
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
  // ClrDropdown's providers are not inherited, so they have to be repeated for this component to be
  // one. Its host directives and host bindings - the popover host, and the dropdown classes - are
  // inherited, and must not be repeated.
  providers: [
    ROOT_DROPDOWN_PROVIDER,
    FOCUS_SERVICE_PROVIDER,
    DROPDOWN_FOCUS_HANDLER_PROVIDER,
    { provide: ClrDropdown, useExisting: ClrDatagridColumnActions },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ClrDatagridColumnActions extends ClrDropdown implements AfterViewInit, OnDestroy {
  // Exposed so the template can compare against the enum.
  protected readonly ClrDatagridSortOrder = ClrDatagridSortOrder;

  private _keepFilterInHeader = false;

  @ViewChild('trigger', { read: ElementRef }) private trigger: ElementRef<HTMLButtonElement>;

  private menuInstance: ClrDropdownMenu;

  // Named for this component rather than inherited: ClrDropdown keeps its own private list.
  private subs: Subscription[] = [];
  private menuItemsSubscription: Subscription;
  private projectedActions: FocusableItem[] = [];
  private viewReady = false;

  constructor(
    protected column: ClrDatagridColumn,
    protected commonStrings: ClrCommonStringsService,
    private columnActions: ColumnActionsService,
    // The column's own popover service, shared with its filter. This component brings its own for
    // the menu, so the menu and the filter never fight over one overlay - which is also why this one
    // has to be resolved from the column rather than from here.
    @SkipSelf() private columnPopover: ClrPopoverService,
    private changeDetectorRef: ChangeDetectorRef,
    private injector: Injector,
    @Optional() private filters: FiltersProvider,
    @SkipSelf() @Optional() parent: ClrDropdown,
    popoverService: ClrPopoverService,
    focusHandler: DropdownFocusHandler,
    dropdownService: RootDropdownService
  ) {
    super(parent, popoverService, focusHandler, changeDetectorRef, dropdownService);

    this.isMenuClosable = false;

    // Tells the filter to drop its own toggle - from here on this menu is the only way to open it,
    // unless clrDgKeepFilterInHeader asked to keep both. Reading the backing field rather than the
    // getter covers the default: Angular only invokes the setter above when the input is actually
    // bound, and by then the field initializer has already run.
    columnActions.present.set(!this._keepFilterInHeader);
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
   * Whether the filter this menu opens is open, for the filter action to report the same way the
   * toggle it replaced did. Read from the column's popover service rather than from the filter,
   * because that service is what the action opens.
   */
  protected get filterOpen(): boolean {
    return this.columnPopover.open;
  }

  /**
   * The popover the filter action opens, so it can point at what it controls - again the same thing
   * the replaced toggle pointed at.
   */
  protected get filterPopoverId(): string | null {
    return this.columnActions.filter()?.popoverId ?? null;
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
    // The trigger and the filter action show whether the column is filtered, and this component is
    // OnPush, so it has to be told when a filter value changes.
    if (this.filters) {
      this.subs.push(this.filters.change.subscribe(() => this.changeDetectorRef.markForCheck()));
    }

    // Same for the filter action reporting whether the filter is open: opening it goes through this
    // template and refreshes the view on its own, but closing it does not - that is an outside click
    // or an escape key handled by the overlay, and the item would be left announcing itself expanded.
    this.subs.push(this.columnPopover.openChange.subscribe(() => this.changeDetectorRef.markForCheck()));

    // The menu is rebuilt on every open, and clrIfOpenChange is what reports that.
    this.viewReady = true;
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.subs.forEach(sub => sub.unsubscribe());
    this.menuItemsSubscription?.unsubscribe();
    // Hands the filter back its own toggle, in case the menu is removed while the column stays.
    this.columnActions.present.set(false);
  }

  /**
   * Called by the projected `clrDgColumnAction` items, which the menu cannot find on its own: its
   * content query only sees what is declared in this template, not what is projected into it.
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
   *
   * Checks `isMenuClosable` for the same reason `clrDropdownItem` does on its own click handler:
   * without it a projected item would close the menu on click while a built-in one, which this
   * component keeps open, would not.
   */
  closeMenu() {
    if (!this.isMenuClosable) {
      return;
    }

    this.focusHandler.focus();
    this.popoverService.open = false;
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
    afterNextRender(() => this.popoverService.updatePosition(), { injector: this.injector });
  }

  /**
   * Moves focus to one of the projected actions, keeping the menu's keyboard handling in step with
   * it.
   *
   * Called by `clrDgColumnAction` when the item takes focus, so that focusing an item by any means -
   * including a plain `focus()` from outside, after an action rebuilt the menu - leaves space and
   * enter acting on that same item rather than on whatever the menu focused when it opened.
   */
  focusAction(item: FocusableItem) {
    this.focusHandler.moveTo(item);
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
   *
   * The columns are relocated on the render cycle the pinned state change schedules, not while this
   * runs, so the overlay can only be re-anchored once that has happened - which `repositionMenu`
   * takes care of.
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

  private linkMenuItems() {
    // The projected items register from their own constructor, which runs while the view is still
    // being created, and the menu itself only exists while it is open.
    if (!this.viewReady || !this.menuInstance) {
      return;
    }

    this.focusHandler.addChildren([...this.menuInstance.items.toArray(), ...this.projectedActions]);
  }
}

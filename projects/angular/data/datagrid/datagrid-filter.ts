/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Optional,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { ClrPopoverPosition, ClrPopoverService, ClrPopoverType } from '@clr/angular/popover/common';
import { ClrCommonStringsService, uniqueIdFactory } from '@clr/angular/utils';
import { Subscription } from 'rxjs';

import { ClrDatagridFilterInterface } from './interfaces/filter.interface';
import { ColumnActionsService } from './providers/column-actions.service';
import { CustomFilter } from './providers/custom-filter';
import { FiltersProvider, RegisteredFilter } from './providers/filters';
import { DatagridFilterRegistrar } from './utils/datagrid-filter-registrar';
import { KeyNavigationGridController } from './utils/key-navigation-grid.controller';

/**
 * Custom filter that can be added in any column to override the default object property string filter.
 * The reason this is not just an input on DatagridColumn is because we need the filter's template to be projected,
 * since it can be anything (not just a text input).
 */
@Component({
  selector: 'clr-dg-filter',
  // We register this component as a CustomFilter, for the parent column to detect it.
  providers: [{ provide: CustomFilter, useExisting: ClrDatagridFilter }],
  template: `
    <!--
      The toggle stands down when the column has a clr-dg-column-actions menu, which then owns
      opening this filter. Nothing else here changes: the popover is still driven through the
      column's ClrPopoverService, the menu just points its origin at its own trigger instead.
    -->
    @if (columnActions?.filterInHeader() ?? true) {
      <button
        class="datagrid-filter-toggle"
        type="button"
        #anchor
        [attr.aria-expanded]="ariaExpanded"
        [attr.aria-controls]="popoverId"
        clrPopoverOrigin
        clrPopoverOpenCloseButton
        [class.datagrid-filter-open]="open"
        [class.datagrid-filtered]="active"
      >
        <cds-icon
          [status]="active ? 'info' : null"
          [shape]="active ? 'filter-grid-circle' : 'filter-grid'"
          solid
        ></cds-icon>
      </button>
    }

    <div
      class="datagrid-filter"
      [id]="popoverId"
      cdkTrapFocus
      *clrPopoverContent="open; at: popoverPosition; type: popoverType; outsideClickToClose: true; scrollToClose: false"
      role="dialog"
      [attr.aria-label]="commonStrings.keys.datagridFilterDialogAriaLabel"
    >
      <div class="datagrid-filter-close-wrapper">
        <button type="button" class="close" clrPopoverCloseButton>
          <cds-icon shape="window-close" [attr.title]="commonStrings.keys.close"></cds-icon>
        </button>
      </div>

      <ng-content></ng-content>
    </div>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrDatagridFilter<T = any>
  extends DatagridFilterRegistrar<T, ClrDatagridFilterInterface<T>>
  implements CustomFilter, OnDestroy
{
  @Output('clrDgFilterOpenChange') openChange = new EventEmitter<boolean>(false);

  popoverId = uniqueIdFactory();

  // Smart Popover
  popoverPosition = ClrPopoverPosition.BOTTOM_RIGHT;
  popoverType = ClrPopoverType.DROPDOWN;

  @ViewChild('anchor', { read: ElementRef }) anchor!: ElementRef<HTMLButtonElement>;

  // Held in a signal, so that the button is updated when the popover opens or closes.
  private readonly _ariaExpanded = signal(false);
  private subs: Subscription[] = [];

  constructor(
    _filters: FiltersProvider<T>,
    public commonStrings: ClrCommonStringsService,
    private popoverService: ClrPopoverService,
    @Optional() private keyNavigation: KeyNavigationGridController,
    @Optional() protected columnActions: ColumnActionsService
  ) {
    super(_filters);
    this.subs.push(
      popoverService.openChange.subscribe(change => {
        this.ariaExpanded = change;
        this.openChange.emit(change);

        // Set here rather than in the open setter, so it applies however the filter is opened - its
        // own toggle, clrDgFilterOpen, or the column actions menu.
        if (keyNavigation) {
          keyNavigation.skipItemFocus = change;
        }
      })
    );

    // Optional so the filter keeps working outside a column, e.g. in isolated tests.
    columnActions?.filter.set(this);
  }

  @Input({ alias: 'clrDgFilterOpen', transform: booleanAttribute })
  get open() {
    return this.popoverService.open;
  }
  set open(open: boolean) {
    if (this.popoverService.open !== open) {
      this.popoverService.open = open;
      this.openChange.emit(open);
    }
  }

  @Input('clrDgFilter')
  set customFilter(filter: ClrDatagridFilterInterface<T> | RegisteredFilter<T, ClrDatagridFilterInterface<T>>) {
    this.setFilter(filter);
  }

  get ariaExpanded(): boolean {
    return this._ariaExpanded();
  }
  set ariaExpanded(expanded: boolean) {
    this._ariaExpanded.set(expanded);
  }

  /**
   * Indicates if the filter is currently active
   */
  get active() {
    // Read to be notified when a filter changes, so that an OnPush view shows it. The filter itself says if it is
    // active, so that a custom filter is shown as active as soon as its `isActive()` returns true.
    this.filters.active();
    return !!this.filter && this.filter.isActive();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.subs.forEach(sub => sub.unsubscribe());

    if (this.columnActions?.filter() === this) {
      this.columnActions.filter.set(null);
    }
  }
}

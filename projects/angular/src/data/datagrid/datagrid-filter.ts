/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, EventEmitter, Input, OnDestroy, Optional, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrDatagridFilterInterface } from './interfaces/filter.interface';
import { ClrPopoverService } from '../../popover';
import { ClrCommonStringsService } from '../../utils';
import { CustomFilter } from './providers/custom-filter';
import { FiltersProvider, RegisteredFilter } from './providers/filters';
import { DatagridFilterRegistrar } from './utils/datagrid-filter-registrar';
import { KeyNavigationGridController } from './utils/key-navigation-grid.controller';
import { ClrPopoverType, getConnectedPositions } from '../../popover/common/utils/popover-positions';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';

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
    <button
      class="datagrid-filter-toggle"
      type="button"
      #anchor
      [attr.aria-expanded]="ariaExpanded"
      [attr.aria-controls]="popoverId"
      clrPopoverAnchor
      clrPopoverOpenCloseButton
      [class.datagrid-filter-open]="open"
      [class.datagrid-filtered]="active"
    >
      <cds-icon
        [attr.status]="active ? 'info' : null"
        [attr.shape]="active ? 'filter-grid-circle' : 'filter-grid'"
        solid
      ></cds-icon>
    </button>

    <div
      class="datagrid-filter"
      [id]="popoverId"
      cdkTrapFocus
      *clrPopoverContent="
        open;
        at: smartPosition;
        availablePositions: positions;
        type: popoverType;
        outsideClickToClose: true;
        scrollToClose: false
      "
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
})
export class ClrDatagridFilter<T = any>
  extends DatagridFilterRegistrar<T, ClrDatagridFilterInterface<T>>
  implements CustomFilter, OnDestroy
{
  @Output('clrDgFilterOpenChange') openChange = new EventEmitter<boolean>(false);

  ariaExpanded = false;
  popoverId = uniqueIdFactory();

  // Smart Popover
  smartPosition = 'bottom-right';
  popoverType = ClrPopoverType.DROPDOWN;
  positions = getConnectedPositions(this.popoverType);

  @ViewChild('anchor', { read: ElementRef }) anchor: ElementRef<HTMLButtonElement>;

  private subs: Subscription[] = [];

  constructor(
    _filters: FiltersProvider<T>,
    public commonStrings: ClrCommonStringsService,
    private popoverService: ClrPopoverService,
    @Optional() private keyNavigation: KeyNavigationGridController
  ) {
    super(_filters);
    this.subs.push(
      popoverService.openChange.subscribe(change => {
        this.ariaExpanded = change;
        this.openChange.emit(change);
      })
    );
  }

  @Input('clrDgFilterOpen')
  get open() {
    return this.popoverService.open;
  }
  set open(open: boolean) {
    open = !!open;

    if (this.popoverService.open !== open) {
      this.popoverService.open = open;
      this.openChange.emit(open);

      if (this.keyNavigation) {
        this.keyNavigation.skipItemFocus = open;
      }
    }
  }

  @Input('clrDgFilter')
  set customFilter(filter: ClrDatagridFilterInterface<T> | RegisteredFilter<T, ClrDatagridFilterInterface<T>>) {
    this.setFilter(filter);
  }

  /**
   * Indicates if the filter is currently active
   */
  get active() {
    return !!this.filter && this.filter.isActive();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.subs.forEach(sub => sub.unsubscribe());
  }
}

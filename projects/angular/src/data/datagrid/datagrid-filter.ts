/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Output,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrAlignment } from '../../utils/popover/enums/alignment.enum';
import { ClrAxis } from '../../utils/popover/enums/axis.enum';
import { ClrSide } from '../../utils/popover/enums/side.enum';
import { ClrPopoverPosition } from '../../utils/popover/interfaces/popover-position.interface';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { ClrDatagridColumn } from './datagrid-column';
import { ClrDatagridFilterInterface } from './interfaces/filter.interface';
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
    <button
      class="datagrid-filter-toggle"
      type="button"
      #anchor
      [attr.aria-label]="toggleButtonAriaLabel"
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
      *clrPopoverContent="open; at: smartPosition; outsideClickToClose: true; scrollToClose: true"
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
})
export class ClrDatagridFilter<T = any>
  extends DatagridFilterRegistrar<T, ClrDatagridFilterInterface<T>>
  implements CustomFilter, OnDestroy
{
  @Output('clrDgFilterOpenChange') openChange = new EventEmitter<boolean>(false);

  ariaExpanded = false;
  popoverId = uniqueIdFactory();

  // Smart Popover
  smartPosition: ClrPopoverPosition = {
    axis: ClrAxis.VERTICAL,
    side: ClrSide.AFTER,
    anchor: ClrAlignment.END,
    content: ClrAlignment.END,
  };

  @ViewChild('anchor', { read: ElementRef }) anchor: ElementRef<HTMLButtonElement>;

  private _open = false;
  private subs: Subscription[] = [];

  constructor(
    _filters: FiltersProvider<T>,
    public commonStrings: ClrCommonStringsService,
    private smartToggleService: ClrPopoverToggleService,
    @Inject(PLATFORM_ID) private platformId: any,
    private elementRef: ElementRef<HTMLElement>,
    @Optional() private keyNavigation: KeyNavigationGridController,
    @Optional() private column: ClrDatagridColumn
  ) {
    super(_filters);
    this.subs.push(
      smartToggleService.openChange.subscribe(change => {
        this.open = change;
        this.ariaExpanded = change;
      })
    );
  }

  @Input('clrDgFilterOpen')
  get open() {
    return this._open;
  }
  set open(open: boolean) {
    open = !!open;
    if (this.open !== open) {
      this.smartToggleService.open = open;
      this.openChange.emit(open);
      if (!open && isPlatformBrowser(this.platformId)) {
        this.anchor.nativeElement.focus();
      }
      if (this.keyNavigation) {
        this.keyNavigation.skipItemFocus = open;
      }
      // keep track of the state
      this._open = open;
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

  get toggleButtonAriaLabel() {
    return this.commonStrings.parse(this.commonStrings.keys.datagridFilterAriaLabel, {
      COLUMN: this.column?.titleContainer?.nativeElement.textContent.trim().toLocaleLowerCase(),
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.subs.forEach(sub => sub.unsubscribe());
  }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrCommonStringsService } from '../../utils';
import { DatagridPropertyComparator } from './built-in/comparators/datagrid-property-comparator';
import { DatagridNumericFilterImpl } from './built-in/filters/datagrid-numeric-filter-impl';
import { DatagridPropertyNumericFilter } from './built-in/filters/datagrid-property-numeric-filter';
import { DatagridPropertyStringFilter } from './built-in/filters/datagrid-property-string-filter';
import { DatagridStringFilterImpl } from './built-in/filters/datagrid-string-filter-impl';
import { ClrDatagridSortOrder } from './enums/sort-order.enum';
import { ClrDatagridComparatorInterface } from './interfaces/comparator.interface';
import { ClrDatagridFilterInterface } from './interfaces/filter.interface';
import { CustomFilter } from './providers/custom-filter';
import { DetailService } from './providers/detail.service';
import { FiltersProvider } from './providers/filters';
import { Sort } from './providers/sort';
import { HIDDEN_COLUMN_CLASS } from './render/constants';
import { DatagridFilterRegistrar } from './utils/datagrid-filter-registrar';
import { WrappedColumn } from './wrapped-column';
import { HostWrapper } from '../../utils/host-wrapping/host-wrapper';
import { ClrPopoverHostDirective } from '../../utils/popover/popover-host.directive';

@Component({
  selector: 'clr-dg-column',
  template: `
    <div class="datagrid-column-flex">
      @if (sortable) {
        <button class="datagrid-column-title" (click)="sort()" type="button" #titleContainer>
          <ng-container *ngTemplateOutlet="columnTitle"></ng-container>
          <cds-icon
            [attr.shape]="sortDirection ? 'arrow' : 'two-way-arrows'"
            [attr.direction]="sortDirection ? sortDirection : 'left'"
            aria-hidden="true"
            class="sort-icon"
          ></cds-icon>
        </button>
      }
      <!-- I'm really not happy with that select since it's not very scalable -->
      <ng-content select="clr-dg-filter, clr-dg-string-filter, clr-dg-numeric-filter"></ng-content>

      @if (field && !customFilter && colType == 'string') {
        <clr-dg-string-filter
          [clrFilterPlaceholder]="filterStringPlaceholder"
          [clrDgStringFilter]="registered"
          [(clrFilterValue)]="filterValue"
        ></clr-dg-string-filter>
      }
      @if (field && !customFilter && colType == 'number') {
        <clr-dg-numeric-filter
          [clrFilterMaxPlaceholder]="filterNumberMaxPlaceholder"
          [clrFilterMinPlaceholder]="filterNumberMinPlaceholder"
          [clrDgNumericFilter]="registered"
          [(clrFilterValue)]="filterValue"
        ></clr-dg-numeric-filter>
      }

      <ng-template #columnTitle>
        <ng-content></ng-content>
      </ng-template>

      @if (!sortable) {
        <span class="datagrid-column-title" #titleContainer>
          <ng-container *ngTemplateOutlet="columnTitle"></ng-container>
        </span>
      }
      @if (showSeparator) {
        <clr-dg-column-separator></clr-dg-column-separator>
      }
    </div>
  `,
  hostDirectives: [ClrPopoverHostDirective],
  host: {
    '[class.datagrid-column]': 'true',
    '[attr.aria-sort]': 'ariaSort',
    role: 'columnheader',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ClrDatagridColumn<T = any>
  extends DatagridFilterRegistrar<T, ClrDatagridFilterInterface<T>>
  implements OnDestroy, OnInit, OnChanges
{
  @Input('clrFilterStringPlaceholder') filterStringPlaceholder: string;
  @Input('clrFilterNumberMaxPlaceholder') filterNumberMaxPlaceholder: string;
  @Input('clrFilterNumberMinPlaceholder') filterNumberMinPlaceholder: string;
  @Input('clrDgDisableUnsort') disableUnsort = false;

  @Output('clrDgSortOrderChange') sortOrderChange = new EventEmitter<ClrDatagridSortOrder>();
  @Output('clrFilterValueChange') filterValueChange = new EventEmitter();

  @ViewChild('titleContainer', { read: ElementRef }) titleContainer: ElementRef<HTMLElement>;

  /**
   * A custom filter for this column that can be provided in the projected content
   */
  customFilter = false;

  /*
   * What type is this column?  This defaults to STRING, but can also be
   * set to NUMBER.  Unsupported types default to STRING. Users can set it
   * via the [clrDgColType] input by setting it to 'string' or 'number'.
   */
  private _colType: 'string' | 'number' = 'string';

  /*
   * Simple object property shortcut, activates both sorting and filtering
   * based on native comparison of the specified property on the items.
   */
  private _field: string;

  /**
   * ClrDatagridComparatorInterface to use when sorting the column
   */
  private _sortBy: ClrDatagridComparatorInterface<T>;

  /**
   * Indicates how the column is currently sorted
   */
  private _sortOrder: ClrDatagridSortOrder = ClrDatagridSortOrder.UNSORTED;

  private _sortDirection: 'up' | 'down' | null;

  // This property holds filter value temporarily while this.filter property is not yet registered
  // When this.filter is registered, this property value would be used update this.filter.value
  //
  private initFilterValue: string | [number, number];

  private wrappedInjector: Injector;

  /**
   * Subscription to the sort service changes
   */
  private subscriptions: Subscription[] = [];

  private _showSeparator = true;

  constructor(
    private el: ElementRef<HTMLElement>,
    private _sort: Sort<T>,
    filters: FiltersProvider<T>,
    private vcr: ViewContainerRef,
    private detailService: DetailService,
    private changeDetectorRef: ChangeDetectorRef,
    private commonStrings: ClrCommonStringsService
  ) {
    super(filters);
    this.subscriptions.push(this.listenForSortingChanges());
    this.subscriptions.push(this.listenForDetailPaneChanges());
  }

  get isHidden() {
    return this.el.nativeElement.classList.contains(HIDDEN_COLUMN_CLASS);
  }

  get showSeparator() {
    return this._showSeparator;
  }
  set showSeparator(value: boolean) {
    this._showSeparator = value;
    this.changeDetectorRef.markForCheck();
  }

  // TODO: We might want to make this an enum in the future
  @Input('clrDgColType')
  get colType() {
    return this._colType;
  }
  set colType(value: 'string' | 'number') {
    this._colType = value;
  }

  @Input('clrDgField')
  get field() {
    return this._field;
  }
  set field(field: string) {
    if (typeof field === 'string') {
      this._field = field;

      if (!this._sortBy) {
        this._sortBy = new DatagridPropertyComparator(field);
      }
    }
  }

  @Input('clrDgSortBy')
  get sortBy() {
    return this._sortBy;
  }
  set sortBy(comparator: ClrDatagridComparatorInterface<T> | string) {
    if (typeof comparator === 'string') {
      this._sortBy = new DatagridPropertyComparator(comparator);
    } else if (comparator) {
      this._sortBy = comparator;
    } else if (this.field) {
      this._sortBy = new DatagridPropertyComparator(this.field);
    } else {
      delete this._sortBy;
    }
  }

  @Input('clrDgSortOrder')
  get sortOrder() {
    return this._sortOrder;
  }
  set sortOrder(value: ClrDatagridSortOrder) {
    if (typeof value === 'undefined') {
      return;
    }

    // only if the incoming order is different from the current one
    if (this._sortOrder === value) {
      return;
    }

    switch (value) {
      case ClrDatagridSortOrder.ASC:
        this.sort(false);
        break;
      case ClrDatagridSortOrder.DESC:
        this.sort(true);
        break;
      // the Unsorted case happens when the current state is neither Asc nor Desc
      case ClrDatagridSortOrder.UNSORTED:
      default:
        this._sort.clear();
        this._sortDirection = null;
        break;
    }
  }

  @Input('clrFilterValue')
  set updateFilterValue(newValue: string | [number, number]) {
    if (this.filter) {
      if (this.filter instanceof DatagridStringFilterImpl) {
        if (!newValue || typeof newValue !== 'string') {
          newValue = '';
        }
        if (newValue !== this.filter.value) {
          this.filter.value = newValue;
        }
      } else if (this.filter instanceof DatagridNumericFilterImpl) {
        if (!newValue || !(newValue instanceof Array)) {
          newValue = [null, null];
        }
        if (newValue.length === 2 && (newValue[0] !== this.filter.value[0] || newValue[1] !== this.filter.value[1])) {
          this.filter.value = newValue;
        }
      }
    } else {
      this.initFilterValue = newValue;
    }
  }

  @ContentChild(CustomFilter)
  set projectedFilter(custom: any) {
    if (custom) {
      this.deleteFilter();
      this.customFilter = true;
    }
  }

  /**
   * Indicates if the column is sortable
   */
  get sortable(): boolean {
    return !!this._sortBy;
  }

  get ariaSort() {
    switch (this._sortOrder) {
      case ClrDatagridSortOrder.ASC:
        return 'ascending';
      case ClrDatagridSortOrder.DESC:
        return 'descending';
      case ClrDatagridSortOrder.UNSORTED:
      default:
        return 'none';
    }
  }

  get sortDirection(): 'up' | 'down' | null {
    return this._sortDirection;
  }

  /**
   * @NOTE type `any` here is to let us pass templateStrictMode, because in our code we try to handle
   * two types of filters String and Number with the same variable but both of them work with different
   * format we got an error for casting. We could not cast anything inside the template so to not mess the
   * casting, the last type is set to `any`
   *
   * Orignial types: string | [number, number]
   */
  get filterValue() {
    if (this.filter instanceof DatagridStringFilterImpl || this.filter instanceof DatagridNumericFilterImpl) {
      return this.filter.value;
    }
    return null;
  }
  set filterValue(newValue: any) {
    if (this.filter instanceof DatagridStringFilterImpl || this.filter instanceof DatagridNumericFilterImpl) {
      this.updateFilterValue = newValue;
      this.filterValueChange.emit(this.filter.value);
    }
  }

  get _view() {
    return this.wrappedInjector.get(WrappedColumn, this.vcr).columnView;
  }

  ngOnInit() {
    this.wrappedInjector = new HostWrapper(WrappedColumn, this.vcr);
  }

  ngAfterViewInit() {
    this.setFilterToggleAriaLabel();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.colType &&
      changes.colType.currentValue &&
      changes.colType.currentValue !== changes.colType.previousValue
    ) {
      if (!this.customFilter && !this.filter && this.colType && this.field) {
        this.setupDefaultFilter(this.field, this.colType);
      }
    }
    if (changes.field && changes.field.currentValue && changes.field.currentValue !== changes.field.previousValue) {
      if (!this.customFilter && this.colType) {
        this.setupDefaultFilter(this.field, this.colType);
      }
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  /**
   * Sorts the datagrid based on this column
   */
  sort(reverse?: boolean) {
    if (!this.sortable) {
      return;
    }

    if (!this.disableUnsort && reverse === undefined && this.sortOrder === ClrDatagridSortOrder.DESC) {
      this._sortOrder = ClrDatagridSortOrder.UNSORTED;
      this._sort.clear();
      this._sortDirection = null;
      this.sortOrderChange.emit(this._sortOrder);
      return;
    }

    this._sort.toggle(this._sortBy, reverse);

    // setting the private variable to not retrigger the setter logic
    this._sortOrder = this._sort.reverse ? ClrDatagridSortOrder.DESC : ClrDatagridSortOrder.ASC;
    // Sets the correct icon for current sort order
    this._sortDirection = this._sortOrder === ClrDatagridSortOrder.DESC ? 'down' : 'up';
    this.sortOrderChange.emit(this._sortOrder);
  }

  private listenForDetailPaneChanges() {
    return this.detailService.stateChange.subscribe(state => {
      if (this.showSeparator !== !state) {
        this.showSeparator = !state;
      }
    });
  }

  private setFilterToggleAriaLabel() {
    const filterToggle = this.el.nativeElement.querySelector('.datagrid-filter-toggle');
    if (filterToggle) {
      filterToggle.ariaLabel = this.commonStrings.parse(this.commonStrings.keys.datagridFilterAriaLabel, {
        COLUMN: this?.titleContainer?.nativeElement.textContent.trim().toLocaleLowerCase(),
      });
    }
  }

  private listenForSortingChanges() {
    return this._sort.change.subscribe(sort => {
      // Need to manually mark the component to be checked
      // for both activating and deactivating sorting
      this.changeDetectorRef.markForCheck();
      // We're only listening to make sure we emit an event when the column goes from sorted to unsorted
      if (this.sortOrder !== ClrDatagridSortOrder.UNSORTED && sort.comparator !== this._sortBy) {
        this._sortOrder = ClrDatagridSortOrder.UNSORTED;
        this.sortOrderChange.emit(this._sortOrder);
        this._sortDirection = null;
      }
    });
  }

  private setupDefaultFilter(field: string, colType: 'string' | 'number') {
    if (colType === 'number') {
      this.setFilter(new DatagridNumericFilterImpl(new DatagridPropertyNumericFilter(field)));
    } else if (colType === 'string') {
      this.setFilter(new DatagridStringFilterImpl(new DatagridPropertyStringFilter(field)));
    }
    if (this.filter && this.initFilterValue) {
      this.updateFilterValue = this.initFilterValue;
      // This initFilterValue should be used only once after the filter registration
      // So deleting this property value to prevent it from being used again
      // if this field property is set again
      delete this.initFilterValue;
    }
  }
}

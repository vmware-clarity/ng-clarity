/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { DomAdapter } from '../../../../utils/dom-adapter/dom-adapter';
import { ClrCommonStringsService } from '../../../../utils/i18n/common-strings.service';
import { ClrPopoverToggleService } from '../../../../utils/popover/providers/popover-toggle.service';
import { ClrDatagridFilter } from '../../datagrid-filter';
import { ClrDatagridDateFilterInterface } from '../../interfaces/date-filter.interface';
import { CustomFilter } from '../../providers/custom-filter';
import { FiltersProvider, RegisteredFilter } from '../../providers/filters';
import { DatagridFilterRegistrar } from '../../utils/datagrid-filter-registrar';
import { DatagridDateFilterImpl } from './datagrid-date-filter-impl';

@Component({
  selector: 'clr-dg-date-filter',
  providers: [{ provide: CustomFilter, useExisting: DatagridDateFilter }],
  template: `
    <clr-dg-filter [clrDgFilter]="registered" [(clrDgFilterOpen)]="open">
      <clr-date-container class="datagrid-date-filter-input">
        <input
          #input_from
          type="date"
          name="from"
          [(clrDate)]="from"
          [placeholder]="minPlaceholderValue"
          [attr.aria-label]="minPlaceholderValue"
        />
      </clr-date-container>
      <clr-date-container class="datagrid-date-filter-input">
        <input
          type="date"
          name="to"
          [(clrDate)]="to"
          [placeholder]="maxPlaceholderValue"
          [attr.aria-label]="maxPlaceholderValue"
        />
      </clr-date-container>
    </clr-dg-filter>
  `,
})
export class DatagridDateFilter<T = any>
  extends DatagridFilterRegistrar<T, DatagridDateFilterImpl<T>>
  implements CustomFilter, AfterViewInit
{
  constructor(
    filters: FiltersProvider<T>,
    private domAdapter: DomAdapter,
    public commonStrings: ClrCommonStringsService,
    private popoverToggleService: ClrPopoverToggleService,
    private ngZone: NgZone
  ) {
    super(filters);
  }

  private subscriptions: Subscription[] = [];

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  /**
   * Provide a way to pass external placeholder and aria-label to the filter input
   */
  @Input('clrFilterMaxPlaceholder') maxPlaceholder: string;

  get maxPlaceholderValue() {
    return this.maxPlaceholder || this.commonStrings.keys.maxValue;
  }

  @Input('clrFilterMinPlaceholder') minPlaceholder: string;

  get minPlaceholderValue() {
    return this.minPlaceholder || this.commonStrings.keys.minValue;
  }

  /**
   * Customizable filter logic based on high and low values
   */
  @Input('clrDgDateFilter')
  set customDateFilter(value: ClrDatagridDateFilterInterface<T> | RegisteredFilter<T, DatagridDateFilterImpl<T>>) {
    if (value instanceof RegisteredFilter) {
      this.setFilter(value);
    } else {
      this.setFilter(new DatagridDateFilterImpl(value));
    }
    if (this.initFilterValues) {
      this.value = this.initFilterValues;
      // This initFilterValues should be used only once after the filter registration
      // So deleting this property value to prevent it from being used again
      // if this customStringFilter property is set again
      delete this.initFilterValues;
    }
  }

  /**
   * Indicates if the filter dropdown is open
   */
  public open = false;

  /**
   * We need the actual input element to automatically focus on it
   */
  @ViewChild('input_from') public input: ElementRef;

  /**
   * We grab the ClrDatagridFilter we wrap to register this StringFilter to it.
   */
  @ViewChild(ClrDatagridFilter) public filterContainer: ClrDatagridFilter<T>;
  ngAfterViewInit() {
    this.subscriptions.push(
      this.popoverToggleService.openChange.subscribe(openChange => {
        this.open = openChange;
        // Note: this is being run outside of the Angular zone because `element.focus()` doesn't require
        // running change detection.
        this.ngZone.runOutsideAngular(() => {
          // The animation frame in used because when this executes, the input isn't displayed.
          // Note: `element.focus()` causes re-layout and this may lead to frame drop on slower devices.
          // `setTimeout` is a macrotask and macrotasks are executed within the current rendering frame.
          // Animation tasks are executed within the next rendering frame.
          requestAnimationFrame(() => {
            this.domAdapter.focus(this.input.nativeElement);
          });
        });
      })
    );
  }

  private initFilterValues: [Date, Date];
  /**
   * Common setter for the input values
   */
  public get value() {
    return [this.filter.from, this.filter.to];
  }

  @Input('clrFilterValue')
  public set value(values: [Date, Date]) {
    if (this.filter && Array.isArray(values)) {
      if (values && (values[0] !== this.filter.from || values[1] !== this.filter.to)) {
        if (typeof values[0] === 'object') {
          this.filter.from = values[0];
        } else {
          this.filter.from = null;
        }
        if (typeof values[1] === 'object') {
          this.filter.to = values[1];
        } else {
          this.filter.to = null;
        }
        this.filterValueChange.emit(values);
      }
    } else {
      this.initFilterValues = values;
    }
  }

  public get from() {
    if (typeof this.filter.from === 'object') {
      return this.filter.from;
    } else {
      return null;
    }
  }

  public set from(from: Date) {
    if (typeof from === 'object' && from !== this.filter.from) {
      if (from && typeof from.setHours === 'function') {
        from.setHours(0, 0, 0, 0); // set from-date to start of day
      }
      this.filter.from = from;
      this.filterValueChange.emit([this.filter.from, this.filter.to]);
    }
  }

  public get to() {
    if (typeof this.filter.to === 'object') {
      return this.filter.to;
    } else {
      return null;
    }
  }

  public set to(to: Date) {
    if (typeof to === 'object' && to !== this.filter.to) {
      if (to && typeof to.setHours === 'function') {
        to.setHours(23, 59, 59, 999); // set to-date to end of day
      }
      this.filter.to = to;
      this.filterValueChange.emit([this.filter.from, this.filter.to]);
    }
  }

  @Output('clrFilterValueChange') filterValueChange = new EventEmitter();
}

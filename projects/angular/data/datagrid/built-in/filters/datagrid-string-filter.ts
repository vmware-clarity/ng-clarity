/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { DatagridStringFilterImpl } from './datagrid-string-filter-impl';
import { ClrPopoverService } from '../../../../popover';
import { DomAdapter } from '../../../../utils/dom-adapter/dom-adapter';
import { ClrCommonStringsService } from '../../../../utils/i18n/common-strings.service';
import { ClrDatagridFilter } from '../../datagrid-filter';
import { ClrDatagridStringFilterInterface } from '../../interfaces/string-filter.interface';
import { CustomFilter } from '../../providers/custom-filter';
import { FiltersProvider, RegisteredFilter } from '../../providers/filters';
import { DatagridFilterRegistrar } from '../../utils/datagrid-filter-registrar';

@Component({
  selector: 'clr-dg-string-filter',
  providers: [{ provide: CustomFilter, useExisting: DatagridStringFilter }],
  template: `
    <clr-dg-filter [clrDgFilter]="registered" [(clrDgFilterOpen)]="open">
      <clr-input-container>
        <label>{{ labelValue }}</label>
        <input
          #input
          type="text"
          autocomplete="off"
          name="search"
          [(ngModel)]="value"
          clrInput
          [attr.aria-label]="placeholderValue"
          [placeholder]="placeholderValue"
        />
      </clr-input-container>
    </clr-dg-filter>
  `,
  standalone: false,
})
export class DatagridStringFilter<T = any>
  extends DatagridFilterRegistrar<T, DatagridStringFilterImpl<T>>
  implements CustomFilter, AfterViewInit, OnChanges, OnDestroy
{
  /**
   * Provide a way to pass external placeholder and aria-label to the filter input
   */
  @Input('clrFilterPlaceholder') placeholder: string;
  @Input('clrFilterLabel') label: string;

  @Output('clrFilterValueChange') filterValueChange = new EventEmitter();

  /**
   * Indicates if the filter dropdown is open
   */
  open = false;

  /**
   * We need the actual input element to automatically focus on it
   */
  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  /**
   * We grab the ClrDatagridFilter we wrap to register this StringFilter to it.
   */
  @ViewChild(ClrDatagridFilter) filterContainer: ClrDatagridFilter<T>;

  labelValue = '';
  private initFilterValue: string;
  private subs: Subscription[] = [];

  constructor(
    filters: FiltersProvider<T>,
    private domAdapter: DomAdapter,
    public commonStrings: ClrCommonStringsService,
    private popoverService: ClrPopoverService,
    private elementRef: ElementRef<HTMLElement>,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    super(filters);
  }

  /**
   * Customizable filter logic based on a search text
   */
  @Input('clrDgStringFilter')
  set customStringFilter(
    value: ClrDatagridStringFilterInterface<T> | RegisteredFilter<T, DatagridStringFilterImpl<T>>
  ) {
    if (value instanceof RegisteredFilter) {
      this.setFilter(value);
    } else {
      this.setFilter(new DatagridStringFilterImpl(value));
    }
    if (this.initFilterValue) {
      this.value = this.initFilterValue;
      // This initFilterValue should be used only once after the filter registration
      // So deleting this property value to prevent it from being used again
      // if this customStringFilter property is set again
      delete this.initFilterValue;
    }
  }

  /**
   * Common setter for the input value
   */
  @Input('clrFilterValue')
  get value() {
    return this.filter.value;
  }
  set value(value: string) {
    if (this.filter && typeof value === 'string') {
      if (!value) {
        value = '';
      }
      if (value !== this.filter.value) {
        this.filter.value = value;
        this.filterValueChange.emit(value);
      }
    } else {
      this.initFilterValue = value;
    }
  }

  get placeholderValue() {
    return this.placeholder || this.commonStrings.keys.filterItems;
  }

  ngAfterViewInit() {
    this.subs.push(
      this.popoverService.openChange.subscribe(openChange => {
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

  ngOnChanges() {
    setTimeout(() => {
      this.setFilterLabel();
      this.cdr.markForCheck();
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.subs.forEach(sub => sub.unsubscribe());
  }

  /**
   * This is not in a getter to prevent "expression has changed after it was checked" errors.
   */
  private setFilterLabel() {
    if (this.label) {
      this.labelValue = this.label;

      return;
    }

    const columnElement = this.elementRef.nativeElement?.closest('clr-dg-column');
    const columnTitleElement = columnElement?.querySelector('.datagrid-column-title');

    this.labelValue = this.commonStrings.parse(this.commonStrings.keys.datagridFilterLabel, {
      COLUMN: columnTitleElement?.textContent.trim() || '',
    });
  }
}

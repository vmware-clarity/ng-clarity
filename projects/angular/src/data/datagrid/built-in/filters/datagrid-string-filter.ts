/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { DomAdapter } from '../../../../utils/dom-adapter/dom-adapter';
import { ClrCommonStringsService } from '../../../../utils/i18n/common-strings.service';
import { ClrPopoverToggleService } from '../../../../utils/popover/providers/popover-toggle.service';
import { ClrDatagridFilter } from '../../datagrid-filter';
import { ClrDatagridStringFilterInterface } from '../../interfaces/string-filter.interface';
import { CustomFilter } from '../../providers/custom-filter';
import { FiltersProvider, RegisteredFilter } from '../../providers/filters';
import { DatagridFilterRegistrar } from '../../utils/datagrid-filter-registrar';
import { DatagridStringFilterImpl } from './datagrid-string-filter-impl';

@Component({
  selector: 'clr-dg-string-filter',
  providers: [{ provide: CustomFilter, useExisting: DatagridStringFilter }],
  template: `
    <clr-dg-filter [clrDgFilter]="registered" [(clrDgFilterOpen)]="open">
      <input
        #input
        type="text"
        autocomplete="off"
        name="search"
        [(ngModel)]="value"
        class="clr-input"
        [attr.aria-label]="placeholderValue"
        [placeholder]="placeholderValue"
      />
    </clr-dg-filter>
  `,
})
export class DatagridStringFilter<T = any>
  extends DatagridFilterRegistrar<T, DatagridStringFilterImpl<T>>
  implements CustomFilter, AfterViewInit, OnDestroy
{
  private subs: Subscription[] = [];
  constructor(
    filters: FiltersProvider<T>,
    private domAdapter: DomAdapter,
    public commonStrings: ClrCommonStringsService,
    private smartToggleService: ClrPopoverToggleService,
    private ngZone: NgZone
  ) {
    super(filters);
  }

  /**
   * Provide a way to pass external placeholder and aria-label to the filter input
   */
  @Input('clrFilterPlaceholder') placeholder: string;

  get placeholderValue() {
    return this.placeholder || this.commonStrings.keys.filterItems;
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
   * Indicates if the filter dropdown is open
   */
  open = false;

  /**
   * We need the actual input element to automatically focus on it
   */
  @ViewChild('input') input: ElementRef;

  /**
   * We grab the ClrDatagridFilter we wrap to register this StringFilter to it.
   */
  @ViewChild(ClrDatagridFilter) filterContainer: ClrDatagridFilter<T>;

  ngAfterViewInit() {
    this.subs.push(
      this.smartToggleService.openChange.subscribe(openChange => {
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

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.subs.forEach(sub => sub.unsubscribe());
  }

  private initFilterValue: string;

  /**
   * Common setter for the input value
   */
  get value() {
    return this.filter.value;
  }
  @Input('clrFilterValue')
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

  @Output('clrFilterValueChange') filterValueChange = new EventEmitter();
}

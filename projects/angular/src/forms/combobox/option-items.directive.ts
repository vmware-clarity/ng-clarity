/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgForOf, NgForOfContext } from '@angular/common';
import {
  Directive,
  DoCheck,
  Input,
  IterableDiffer,
  IterableDiffers,
  OnDestroy,
  TemplateRef,
  TrackByFunction,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrPopoverPositionService } from '../../utils/popover/providers/popover-position.service';
import { OptionSelectionService } from './providers/option-selection.service';

@Directive({
  selector: '[clrOptionItems][clrOptionItemsOf]',
  standalone: false,
})
export class ClrOptionItems<T> implements DoCheck, OnDestroy {
  private iterableProxy: NgForOf<T>;
  private _rawItems: T[];
  private filteredItems: T[];
  private subscriptions: Subscription[] = [];
  private filter = '';
  private _filterField: string;
  private differ: IterableDiffer<T> | null = null;

  constructor(
    public template: TemplateRef<NgForOfContext<T>>,
    private differs: IterableDiffers,
    private optionService: OptionSelectionService<T>,
    private positionService: ClrPopoverPositionService,
    vcr: ViewContainerRef
  ) {
    this.iterableProxy = new NgForOf<T>(vcr, template, differs);
    this.subscriptions.push(
      optionService.inputChanged.subscribe(filter => {
        this.filter = filter;
        this.updateItems();
      })
    );
  }

  @Input('clrOptionItemsOf')
  set rawItems(items: T[]) {
    this._rawItems = items ? items : [];
    this.updateItems();
  }

  @Input('clrOptionItemsTrackBy')
  set trackBy(value: TrackByFunction<T>) {
    this.iterableProxy.ngForTrackBy = value;
  }

  @Input('clrOptionItemsField')
  set field(field: string) {
    this._filterField = field;
    this.optionService.displayField = field;
  }

  get hasResults() {
    // explicity return `undefined` instead of `false` if the answer is not known
    return this.filteredItems ? this.filteredItems.length : undefined;
  }

  ngDoCheck() {
    if (!this.differ) {
      this.differ = this.differs.find(this.filteredItems).create(this.iterableProxy.ngForTrackBy);
    }
    if (this.differ) {
      const changes = this.differ.diff(this.filteredItems);
      if (changes) {
        this.iterableProxy.ngDoCheck();
        this.positionService.realign();
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  private updateItems() {
    if (!this._rawItems || this.filter === undefined || this.filter === null) {
      return;
    }

    const normalizedFilterValue = normalizeValue(this.filter);

    if (this.optionService.showAllOptions) {
      this.filteredItems = this._rawItems;
    } else if (this._filterField) {
      this.filteredItems = this._rawItems.filter(item => {
        const objValue = (item as any)[this._filterField];
        return objValue ? normalizeValue(objValue).includes(normalizedFilterValue) : false;
      });
    } else {
      // Filter by all item object values
      this.filteredItems = this._rawItems.filter(item => {
        if (typeof item !== 'object') {
          return normalizeValue(item).includes(normalizedFilterValue);
        }
        const objValues = Object.values(item).filter(value => {
          return value !== null && value !== undefined ? normalizeValue(value).includes(normalizedFilterValue) : false;
        });
        return objValues.length > 0;
      });
    }
    this.iterableProxy.ngForOf = this.filteredItems;
  }
}

function normalizeValue(value: any) {
  return value
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

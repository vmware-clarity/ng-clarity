/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { ClrCommonStringsService } from '@clr/angular/utils';

import { MAX_DISPLAY_ITEMS } from './breadcrumbs.constants';
import { BreadcrumbItem } from './model/breadcrumbs.model';

@Component({
  selector: 'clr-breadcrumbs',
  templateUrl: './breadcrumbs.html',
  styleUrls: ['./_breadcrumbs.clarity.scss'],
  host: {
    class: 'clr-breadcrumb',
    '[attr.aria-label]': 'commonStrings.keys.breadcrumbsLabel',
    '[attr.role]': '"navigation"',
  },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrBreadcrumbs implements DoCheck {
  isExpanded = false;
  @Output() clrBreadcrumbItemClick: EventEmitter<BreadcrumbItem> = new EventEmitter<BreadcrumbItem>();
  protected limit: number = MAX_DISPLAY_ITEMS;
  protected max: number = MAX_DISPLAY_ITEMS;

  // Programmatic writes (e.g. through a ViewChild) must still render under OnPush.
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private _items: BreadcrumbItem[] = [];
  private itemsSnapshot: BreadcrumbItem[] = [];

  constructor(protected commonStrings: ClrCommonStringsService) {}

  @Input()
  get items(): BreadcrumbItem[] {
    return this._items;
  }
  set items(value: BreadcrumbItem[]) {
    this._items = value;
    this.changeDetectorRef.markForCheck();
  }

  ngDoCheck() {
    // The template reads the array contents, so in-place mutations (push, splice, item replacement) are
    // detected here with a shallow comparison against the last rendered contents.
    const items = this._items;
    const snapshot = this.itemsSnapshot;
    if (items?.length !== snapshot.length || items?.some((item, index) => item !== snapshot[index])) {
      this.itemsSnapshot = items ? [...items] : [];
      this.changeDetectorRef.markForCheck();
    }
  }

  protected expand() {
    this.isExpanded = true;
    this.limit = this.items?.length;
    this.changeDetectorRef.markForCheck();
  }

  protected handleItemClick(breadcrumb: BreadcrumbItem) {
    this.clrBreadcrumbItemClick.emit(breadcrumb);
  }
}

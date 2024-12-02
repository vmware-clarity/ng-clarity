/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MAX_ITEMS } from './breadcrumbs.constants';
import { BreadcrumbItem } from './model/breadcrumbs.model';
@Component({
  selector: 'clr-breadcrumbs',
  templateUrl: './breadcrumbs.html',
  styleUrls: ['./_breadcrumbs.clarity.scss'],
  host: {
    class: 'clr-breadcrumb',
    '[attr.aria-label]': '"breadcrumb"',
    '[attr.role]': '"navigation"',
  },
})
export class ClrBreadcrumbs {
  @Input() items: BreadcrumbItem[] = [];
  @Output() clrBreadcrumbItemClick: EventEmitter<BreadcrumbItem> = new EventEmitter<BreadcrumbItem>();

  isExpanded = false;
  max: number = MAX_ITEMS;
  limit: number = MAX_ITEMS;

  handleItemClick(breadcrumb: BreadcrumbItem) {
    this.clrBreadcrumbItemClick.emit(breadcrumb);
  }

  expand() {
    this.isExpanded = true;
    this.limit = this.items?.length;
  }
}

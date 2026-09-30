/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, signal } from '@angular/core';

/**
 * The part of a filter that the actions menu needs. Declared here rather than importing
 * ClrDatagridFilter, which would close an import cycle back through this service.
 */
export interface ColumnFilterHandle {
  readonly active: boolean;

  /**
   * The id of the popover the filter renders its content into, for the menu item that opens it to
   * point `aria-controls` at. Optional because it only exists once the filter has an element to
   * label - a handle can register before then.
   */
  readonly popoverId?: string;
}

/**
 * Lets `clr-dg-column-actions` and the filter of the same column find each other without either
 * importing the other, and without depending on the order they are declared in.
 *
 * It is provided by `ClrDatagridColumn`, so every filter flavour resolves the same instance - a
 * projected `clr-dg-filter` is a content child of the column, and the `clr-dg-string-filter` and
 * `clr-dg-numeric-filter` the column creates for `clrDgField` live in its view.
 */
@Injectable()
export class ColumnActionsService {
  /**
   * Whether the filter keeps its own toggle in the column header. An actions menu turns this off and
   * opens the filter itself, so the header keeps a single control per column - unless
   * `clrDgKeepFilterInHeader` asks to keep the toggle.
   *
   * A signal rather than a plain flag because the menu and the filter are siblings: either can be
   * created first, and the filter has to react whenever the answer changes.
   */
  readonly filterInHeader = signal(true);

  /**
   * Whether the column has an actions menu at all, whatever it does with the filter. While it does,
   * the column drops its own pin toggle, because the menu offers Pin Column instead.
   */
  readonly menuPresent = signal(false);

  /** The filter rendered for this column, if it has one. */
  readonly filter = signal<ColumnFilterHandle | null>(null);
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, HostListener, inject } from '@angular/core';
import { ClrDropdownItem } from '@clr/angular/popover/dropdown';
import { BASIC_FOCUSABLE_ITEM_PROVIDER } from '@clr/angular/utils';

import { ClrDatagridColumnActions } from './datagrid-column-actions';

/**
 * A `clrDropdownItem` for a `clr-dg-column-actions` menu. It is the dropdown item - same inputs,
 * styling, arrow key order and close-on-click behaviour - with what a column action needs on top.
 *
 * An item that keeps the menu open (`[clrCloseMenuOnClick]="false"`) re-anchors it after the click.
 * The menu is anchored to a trigger that travels with the column, so an action that moves the column
 * would otherwise leave the menu hanging where the column used to be. The built-in Pin Column action
 * behaves the same way.
 *
 * A plain `clrDropdownItem` can be projected as well; it only lacks the re-anchoring.
 */
@Directive({
  selector: '[clrDgColumnAction]',
  // Providers are not inherited from ClrDropdownItem, and without its own FocusableItem the item
  // would resolve the menu's DropdownFocusHandler instead.
  providers: [BASIC_FOCUSABLE_ITEM_PROVIDER],
  standalone: false,
})
export class ClrDatagridColumnAction extends ClrDropdownItem {
  private readonly columnActions = inject(ClrDatagridColumnActions);

  @HostListener('click')
  protected onColumnActionClick(): void {
    if (!this.disabled && this.closeMenuOnClick === false) {
      this.columnActions.repositionMenu();
    }
  }
}

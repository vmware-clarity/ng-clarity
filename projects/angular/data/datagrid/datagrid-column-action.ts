/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { booleanAttribute, Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { ClrDropdownItem, RootDropdownService } from '@clr/angular/popover/dropdown';
import { BASIC_FOCUSABLE_ITEM_PROVIDER, FocusableItem } from '@clr/angular/utils';

import { ClrDatagridColumnActions } from './datagrid-column-actions';

/**
 * An application provided item in a `clr-dg-column-actions` menu. It is the dropdown item - same
 * inputs, styling and arrow key order - with what a column action needs on top: it closes the menu
 * when picked, or re-anchors it after an action that leaves it open.
 */
@Directive({
  selector: '[clrDgColumnAction]',
  providers: [BASIC_FOCUSABLE_ITEM_PROVIDER],
  standalone: false,
})
export class ClrDatagridColumnAction extends ClrDropdownItem {
  /**
   * Whether activating this item should close the menu.
   */
  @Input({ alias: 'clrCanClosePopover', transform: booleanAttribute }) canClosePopover = true;

  constructor(
    private columnActions: ClrDatagridColumnActions,
    item: FocusableItem,
    dropdownService: RootDropdownService,
    el: ElementRef,
    renderer: Renderer2
  ) {
    super(columnActions, dropdownService, item, el, renderer);
  }

  // Space and enter both turn into a click, so this covers the keyboard as well.
  @HostListener('click')
  protected onColumnActionClick() {
    if (this.disabled) {
      return;
    }

    if (this.canClosePopover) {
      this.columnActions.closeMenu();
    } else {
      this.columnActions.repositionMenu();
    }
  }

  /**
   * Focus can arrive from anywhere - the arrow keys, or a plain `focus()` from an application that
   * moved the column this action belongs to and rebuilt the menu. Reporting it keeps space and enter
   * acting on this item rather than on whatever the menu focused when it opened.
   */
  @HostListener('focus')
  protected onFocus() {
    this.columnActions.focusAction(this.focusableItem);
  }
}

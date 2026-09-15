/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { booleanAttribute, Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2 } from '@angular/core';
import { ClrDropdownItem, RootDropdownService } from '@clr/angular/popover/dropdown';
import { BASIC_FOCUSABLE_ITEM_PROVIDER, FocusableItem } from '@clr/angular/utils';

import { ClrDatagridColumnActions } from './datagrid-column-actions';

/**
 * An application provided item in a `clr-dg-column-actions` menu. It is the dropdown item - same
 * inputs, styling, arrow key order and close-on-click behaviour - with the two things a column
 * action needs on top: it registers itself with the menu, which cannot find projected items on its
 * own, and it re-anchors the menu after an action that leaves it open.
 */
@Directive({
  selector: '[clrDgColumnAction]',
  providers: [BASIC_FOCUSABLE_ITEM_PROVIDER],
  standalone: false,
})
export class ClrDatagridColumnAction extends ClrDropdownItem implements OnDestroy {
  /**
   * Whether activating this item should close the menu.
   *
   * An action that moves the column it belongs to has to say `false` here. The menu is anchored to a
   * trigger that travels with the column, so closing it is not the only thing that can happen -
   * leaving it open where the column used to be would be worse. With `false` the menu is re-anchored
   * to the trigger in its new place instead, which is what the built-in pin action does.
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

    columnActions.registerAction(item);
  }

  ngOnDestroy() {
    this.columnActions.unregisterAction(this.focusableItem);
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

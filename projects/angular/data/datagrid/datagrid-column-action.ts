/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { booleanAttribute, Directive, HostListener, Input, OnDestroy } from '@angular/core';
import { BASIC_FOCUSABLE_ITEM_PROVIDER, FocusableItem } from '@clr/angular/utils';

import { ClrDatagridColumnActions } from './datagrid-column-actions';

/**
 * Marks an application provided item in a `clr-dg-column-actions` menu, giving it the same styling,
 * arrow key navigation and close-on-click behaviour as the built-in items.
 *
 * `clrDropdownItem` cannot be used for this. Injection resolves from where a node is declared rather
 * than where it ends up rendered, so an item projected into `clr-dg-column-actions` sits outside the
 * injector of the `clr-dropdown` in that component's template and cannot find `ClrDropdown`. This
 * directive instead registers with the component it is projected into, which does resolve, and lets
 * that component hand it to the dropdown.
 */
@Directive({
  selector: '[clrDgColumnAction]',
  host: {
    '[class.dropdown-item]': 'true',
    '[class.disabled]': 'disabled',
    '[attr.role]': '"menuitem"',
    '[attr.aria-disabled]': 'disabled',
  },
  providers: [BASIC_FOCUSABLE_ITEM_PROVIDER],
  standalone: false,
})
export class ClrDatagridColumnAction implements OnDestroy {
  constructor(
    private columnActions: ClrDatagridColumnActions,
    private focusableItem: FocusableItem
  ) {
    columnActions.registerAction(focusableItem);
  }

  @Input({ alias: 'clrDisabled', transform: booleanAttribute })
  get disabled(): boolean {
    return this.focusableItem.disabled;
  }
  set disabled(value: boolean) {
    this.focusableItem.disabled = value;
  }

  ngOnDestroy() {
    this.columnActions.unregisterAction(this.focusableItem);
  }

  @HostListener('click')
  protected onClick() {
    if (!this.disabled) {
      this.columnActions.closeMenu();
    }
  }

  // A disabled item still receives the keydown, so it has to swallow it before it turns into a click.
  @HostListener('keydown.space', ['$event'])
  @HostListener('keydown.enter', ['$event'])
  protected onActivate(event: KeyboardEvent) {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}

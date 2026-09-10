/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, HostListener, Input, Optional, Renderer2 } from '@angular/core';
import { BASIC_FOCUSABLE_ITEM_PROVIDER, FocusableItem, FocusService } from '@clr/angular/utils';

import { ClrDropdown } from './dropdown';
import { RootDropdownService } from './providers/dropdown.service';

@Directive({
  selector: '[clrDropdownItem]',
  host: {
    '[class.disabled]': 'disabled',
    '[class.dropdown-item]': 'true',
    '[attr.role]': '"menuitem"',
    '[attr.aria-disabled]': 'disabled',
    '[attr.id]': 'dropdownItemId',
  },
  providers: [BASIC_FOCUSABLE_ITEM_PROVIDER],
  standalone: false,
})
export class ClrDropdownItem {
  /**
   * Whether activating this item closes the menu. Left unset, the item follows the dropdown's
   * `clrCloseMenuOnItemClick`. Set it per item for a menu where most items close but a few have to
   * stay open, such as a toggle whose next action is the one that undoes it.
   */
  @Input('clrCloseMenuOnClick') closeMenuOnClick: boolean | undefined;

  constructor(
    private dropdown: ClrDropdown,
    private _dropdownService: RootDropdownService,
    private focusableItem: FocusableItem,
    // Optional only for tests that stand the item up against a bare ClrDropdown stub; a real dropdown
    // always provides it.
    @Optional() private focusService: FocusService | null,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  @Input('clrDisabled')
  get disabled() {
    return this.focusableItem.disabled;
  }
  set disabled(value: boolean | string) {
    // Empty string attribute evaluates to false but should disable the item, so we need to add a special case for it.
    this.focusableItem.disabled = !!value || value === '';
  }

  /**
   * Let you overwrite the focusable auto increment id.
   */
  @Input('id')
  get dropdownItemId() {
    return this.focusableItem.id;
  }
  set dropdownItemId(value: string) {
    this.focusableItem.id = value;
  }

  private get closesMenu(): boolean {
    return this.closeMenuOnClick ?? this.dropdown.isMenuClosable;
  }

  @HostListener('click')
  private onDropdownItemClick(): void {
    // Move focus back to the root dropdown trigger.
    // This is done BEFORE the dropdown is closed so that focus gets moved properly if a modal is opened.
    if (this.closesMenu && !this.disabled && this.dropdown.popoverService.open) {
      const rootDropdown = this.findRootDropdown();

      rootDropdown.focusHandler.focus();
    }

    // Ensure that the dropdown is closed after custom dropdown item click event handlers have run.
    setTimeout(() => {
      if (this.closesMenu && !this.disabled) {
        this._dropdownService.closeMenus();
      }
    });
  }

  /**
   * Space and enter act on the item the focus service considers current, not on whatever the browser
   * has focused. Focus can arrive from outside the arrow key handling - a plain `focus()` from an
   * application, say - so it is reported back here to keep the two in step.
   */
  @HostListener('focus')
  private onFocus(): void {
    if (this.focusService && this.focusService.current !== this.focusableItem) {
      this.focusService.moveTo(this.focusableItem);
    }
  }

  @HostListener('keydown.space', ['$event'])
  private onSpaceKeydown($event: KeyboardEvent) {
    this.stopImmediatePropagationIfDisabled($event);
  }

  @HostListener('keydown.enter', ['$event'])
  private onEnterKeydown($event: KeyboardEvent) {
    this.stopImmediatePropagationIfDisabled($event);
  }

  private stopImmediatePropagationIfDisabled($event: Event) {
    if (this.disabled) {
      $event.preventDefault(); // prevent click event
      $event.stopImmediatePropagation();
    }
  }

  private findRootDropdown() {
    let rootDropdown = this.dropdown;

    while (rootDropdown.parent) {
      rootDropdown = rootDropdown.parent;
    }

    return rootDropdown;
  }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

import { BASIC_FOCUSABLE_ITEM_PROVIDER } from '../../utils/focus/focusable-item/basic-focusable-item.service';
import { FocusableItem } from '../../utils/focus/focusable-item/focusable-item';
import { ClrDropdown } from './dropdown';
import { RootDropdownService } from './providers/dropdown.service';
import { wrapHostContentInsideSpan } from './utils/content-wrapping';

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
})
export class ClrDropdownItem {
  constructor(
    private dropdown: ClrDropdown,
    private _dropdownService: RootDropdownService,
    private focusableItem: FocusableItem,
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

  ngAfterViewInit() {
    wrapHostContentInsideSpan(this.el.nativeElement, this.renderer, 'dropdown-item-content');
  }

  @HostListener('click')
  private onDropdownItemClick(): void {
    // Move focus back to the root dropdown trigger.
    // This is done BEFORE the dropdown is closed so that focus gets moved properly if a modal is opened.
    if (this.dropdown.isMenuClosable && !this.disabled && this.dropdown.toggleService.open) {
      const rootDropdown = this.findRootDropdown();

      rootDropdown.focusHandler.focus();
      // Prevent moving focus back to the trigger when the dropdown menu is closed.
      // Without this line, focus could be "stolen" from a modal that was opened from a dropdown item.
      rootDropdown.focusHandler.focusBackOnTriggerWhenClosed = false;
    }

    // Ensure that the dropdown is closed after custom dropdown item click event handlers have run.
    setTimeout(() => {
      if (this.dropdown.isMenuClosable && !this.disabled) {
        this._dropdownService.closeMenus();
      }
    });
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

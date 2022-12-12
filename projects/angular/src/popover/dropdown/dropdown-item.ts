/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, HostListener, Input } from '@angular/core';

import { BASIC_FOCUSABLE_ITEM_PROVIDER } from '../../utils/focus/focusable-item/basic-focusable-item.service';
import { FocusableItem } from '../../utils/focus/focusable-item/focusable-item';
import { ClrDropdown } from './dropdown';
import { RootDropdownService } from './providers/dropdown.service';

@Directive({
  selector: '[clrDropdownItem]',
  host: {
    '[class.disabled]': 'disabled',
    '[class.dropdown-item]': 'true',
    '[attr.role]': '"menuitem"',
    '[attr.aria-disabled]': 'disabled',
    '[attr.disabled]': "(disabled && setByDeprecatedDisabled)? '' : null",
    '[attr.id]': 'dropdownItemId',
  },
  providers: [BASIC_FOCUSABLE_ITEM_PROVIDER],
})
export class ClrDropdownItem {
  constructor(
    private dropdown: ClrDropdown,
    private _dropdownService: RootDropdownService,
    private focusableItem: FocusableItem
  ) {}

  setByDeprecatedDisabled = false;

  @Input('clrDisabled')
  set disabled(value: boolean | string) {
    // Empty string attribute evaluates to false but should disable the item, so we need to add a special case for it.
    this.focusableItem.disabled = !!value || value === '';
  }

  get disabled() {
    return this.focusableItem.disabled;
  }

  /*
   * @deprecated since 3.0, remove in 4.0. the presence of this attribute makes it not-focusable in IE11. Use [clrDisabled] input instead.
   */
  @Input('disabled')
  set disabledDeprecated(value: boolean | string) {
    // Empty string attribute evaluates to false but should disable the item, so we need to add a special case for it.
    this.focusableItem.disabled = !!value || value === '';
    this.setByDeprecatedDisabled = true;
  }

  get disabledDeprecated() {
    return this.focusableItem.disabled;
  }

  /**
   * Let you overwrite the focusable auto increment id.
   */
  @Input('id')
  set dropdownItemId(value: string) {
    this.focusableItem.id = value;
  }
  get dropdownItemId() {
    return this.focusableItem.id;
  }

  @HostListener('click')
  private onDropdownItemClick(): void {
    // Ensure that the dropdown is closed after custom dropdown item click event handlers have run.
    setTimeout(() => {
      if (this.dropdown.isMenuClosable && !this.disabled) {
        this._dropdownService.closeMenus();
      }
    });
  }
}

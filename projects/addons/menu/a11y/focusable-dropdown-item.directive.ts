/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive } from '@angular/core';
import { ClrDropdownItem } from '@clr/angular/popover/dropdown';

import { ClrDropdownItemPrivate } from './clarity-private/dropdown-item';
import { FocusableItemProvider } from './focusable-item-provider';

@Directive({
  selector: '[clrDropdownItem][appfxFocusableDropdownItem]',
  standalone: false,
  providers: [{ provide: FocusableItemProvider, useExisting: FocusableDropdownItemDirective }],
})
/**
 * Pulls out the FocusableItem instance associated with a clrDropdownItem.
 */
export class FocusableDropdownItemDirective implements FocusableItemProvider {
  constructor(private menu: ClrDropdownItem) {}

  getFocusableItem(): any {
    return (this.menu as unknown as ClrDropdownItemPrivate).focusableItem;
  }
}

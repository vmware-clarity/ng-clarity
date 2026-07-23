/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, inject } from '@angular/core';
import { ClrDropdownMenu } from '@clr/angular/popover/dropdown';

import { ClrDropdownMenuPrivate } from './clarity-private/dropdown-menu';
import { FocusableItemProvider } from './focusable-item-provider';

@Directive({
  selector: 'clr-dropdown-menu[appfxFocusableMenu]',
  standalone: false,
  providers: [{ provide: FocusableItemProvider, useExisting: FocusableMenuDirective }],
})
/**
 * Pulls out the FocusableItem instance associated with a clr-dropdown-menu.
 */
export class FocusableMenuDirective implements FocusableItemProvider {
  private menu: ClrDropdownMenu = inject(ClrDropdownMenu);

  getFocusableItem(): any {
    return (this.menu as unknown as ClrDropdownMenuPrivate).focusHandler;
  }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, forwardRef } from '@angular/core';

import { MenuItem, MenuItemType } from './menu-item.token';

@Component({
  selector: 'appfx-menu-separator',
  standalone: false,
  template: '',
  providers: [
    {
      provide: MenuItem,
      useExisting: forwardRef(() => MenuSeparatorComponent),
    },
  ],
})
export class MenuSeparatorComponent extends MenuItem {
  type = MenuItemType.separator;
}

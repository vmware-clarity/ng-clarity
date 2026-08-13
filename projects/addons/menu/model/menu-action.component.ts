/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';

import { MenuItem, MenuItemType } from './menu-item.token';

@Component({
  selector: 'appfx-menu-action',
  standalone: false,
  template: '',
  providers: [
    {
      provide: MenuItem,
      useExisting: forwardRef(() => MenuActionComponent),
    },
  ],
})
export class MenuActionComponent extends MenuItem {
  override type = MenuItemType.action;

  @Input() iconClass?: string;

  @Input() text?: string;

  @Input() shortcut?: string;

  @Input() enabled?: boolean = true;

  @Output() handle: EventEmitter<void> = new EventEmitter<void>(true);
}

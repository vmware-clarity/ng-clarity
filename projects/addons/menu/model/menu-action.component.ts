/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnChanges,
  Output,
} from '@angular/core';

import { MenuItem, MenuItemType } from './menu-item.token';
import { NestedMenu } from './nested-menu';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuActionComponent extends MenuItem implements OnChanges {
  override type = MenuItemType.action;

  @Input() iconClass?: string;

  @Input() text?: string;

  @Input() shortcut?: string;

  @Input() enabled?: boolean = true;

  @Output() handle: EventEmitter<void> = new EventEmitter<void>(true);

  private readonly menu = inject(NestedMenu, { optional: true });

  ngOnChanges(): void {
    // The menu renders this item, so it has to learn about the change.
    this.menu?.itemChanged();
  }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChild, Input } from '@angular/core';

import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrOptionItems } from './option-items.directive';

@Component({
  selector: 'clr-option-group',
  host: {
    '[attr.role]': '"group"',
    '[attr.aria-labelledby]': 'labelId',
    '[style.display]': 'clrOptionItems.hasResults ? undefined : "none"',
  },
  template: `
    <span [id]="labelId" class="clr-option-group-label" role="presentation">{{ label }}</span>
    <ng-content></ng-content>
  `,
})
export class ClrOptionGroup<T> {
  @Input('clrOptionGroupLabel') label: string;

  @ContentChild(ClrOptionItems) protected clrOptionItems: ClrOptionItems<T>;

  protected labelId = uniqueIdFactory();
}

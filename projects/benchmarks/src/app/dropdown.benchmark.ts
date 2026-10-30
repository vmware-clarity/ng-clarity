/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrDropdownModule } from '@clr/angular';

import { generateItems, sizeParam } from './data';

@Component({
  selector: 'app-dropdown-benchmark',
  imports: [ClrDropdownModule],
  template: `
    <clr-dropdown>
      <button type="button" class="btn btn-outline-primary" clrDropdownTrigger>Actions</button>
      <clr-dropdown-menu *clrIfOpen>
        @for (item of items; track item.id) {
          <button type="button" clrDropdownItem>{{ item.name }}</button>
        }
      </clr-dropdown-menu>
    </clr-dropdown>
  `,
})
export class DropdownBenchmark {
  readonly items = generateItems(sizeParam(50));
}

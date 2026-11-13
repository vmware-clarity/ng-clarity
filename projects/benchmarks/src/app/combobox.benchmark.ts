/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrComboboxModule } from '@clr/angular';

import { generateItems, sizeParam } from './data';

@Component({
  selector: 'app-combobox-benchmark',
  imports: [ClrComboboxModule, FormsModule],
  template: `
    <clr-combobox-container>
      <label>Virtual machine</label>
      <clr-combobox [(ngModel)]="selection" name="vm" clrMulti="true">
        <ng-container *clrOptionSelected="let selected">{{ selected?.name }}</ng-container>
        <clr-options>
          <clr-option *clrOptionItems="let item of items; field: 'name'" [clrValue]="item">
            {{ item.name }}
          </clr-option>
        </clr-options>
      </clr-combobox>
    </clr-combobox-container>
  `,
})
export class ComboboxBenchmark {
  readonly items = generateItems(sizeParam(1000));
  selection = [];
}

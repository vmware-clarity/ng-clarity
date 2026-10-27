/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrComboboxModule } from '@clr/angular';

import { GroupedStates, groupedStates } from './states';

@Component({
  selector: 'clr-combobox-grouping-example',
  templateUrl: './grouping.example.html',
  imports: [FormsModule, ClrComboboxModule],
})
export class ComboboxGroupingExample {
  groupedStates = groupedStates;
  selection: GroupedStates[] = [];
}

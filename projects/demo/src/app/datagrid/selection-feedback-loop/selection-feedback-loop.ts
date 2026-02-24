/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';

@Component({
  selector: 'clr-datagrid-selection-feedback-loop-demo',
  providers: [Inventory],
  templateUrl: 'selection-feedback-loop.html',
  styleUrls: ['../datagrid.demo.scss'],
  standalone: false,
})
export class DatagridSelectionFeedbackLoopDemo {
  users: User[];
  multiSelected: User[] = [];
  singleSelected: User[] = [];

  multiEmitCount = 0;
  singleEmitCount = 0;
  multiLog: string[] = [];
  singleLog: string[] = [];

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }

  onMultiSelectedChange(selected: User[]) {
    this.multiEmitCount++;
    this.multiLog.unshift(
      `#${this.multiEmitCount}: emitted ${selected.length} item(s) — ${selected.map(u => u.name).join(', ') || '(none)'}`
    );
    if (this.multiLog.length > 20) {
      this.multiLog.length = 20;
    }
  }

  onSingleSelectedChange(selected: User[]) {
    this.singleEmitCount++;
    this.singleLog.unshift(
      `#${this.singleEmitCount}: emitted ${selected?.length ?? 0} item(s) — ${selected?.map(u => u.name).join(', ') || '(none)'}`
    );
    if (this.singleLog.length > 20) {
      this.singleLog.length = 20;
    }
  }

  resetMulti() {
    this.multiSelected = [];
    this.multiEmitCount = 0;
    this.multiLog = [];
  }

  resetSingle() {
    this.singleSelected = [];
    this.singleEmitCount = 0;
    this.singleLog = [];
  }
}

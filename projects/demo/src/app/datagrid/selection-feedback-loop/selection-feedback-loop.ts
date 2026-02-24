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
  manualMultiSelected: User[] = [];
  manualMultiEmitCount = 0;
  manualMultiLog: string[] = [];
  manualSingleSelected: User[] = [];
  manualSingleEmitCount = 0;
  manualSingleLog: string[] = [];
  oneWayMultiSelected: User[] = [];
  oneWayMultiEmitCount = 0;
  oneWayMultiLog: string[] = [];
  oneWaySingleSelected: User[] = [];
  oneWaySingleEmitCount = 0;
  oneWaySingleLog: string[] = [];
  oneWayManualMultiSelected: User[] = [];
  oneWayManualMultiEmitCount = 0;
  oneWayManualMultiLog: string[] = [];
  oneWayManualSingleSelected: User[] = [];
  oneWayManualSingleEmitCount = 0;
  oneWayManualSingleLog: string[] = [];

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
    this.singleLog.unshift(`#${this.singleEmitCount}: emitted — ${selected?.[0]?.name || '(none)'}`);
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

  onManualMultiSelectedChange(selected: User[]) {
    this.manualMultiEmitCount++;
    this.manualMultiLog.unshift(
      `#${this.manualMultiEmitCount}: emitted ${selected.length} item(s) — ${selected.map(u => u.name).join(', ') || '(none)'}`
    );
    if (this.manualMultiLog.length > 20) {
      this.manualMultiLog.length = 20;
    }
  }

  selectFirst3() {
    this.manualMultiSelected = this.users.slice(0, 3);
  }

  selectLast3() {
    this.manualMultiSelected = this.users.slice(-3);
  }

  selectAll() {
    this.manualMultiSelected = [...this.users];
  }

  clearManualSelection() {
    this.manualMultiSelected = [];
  }

  resetManualMulti() {
    this.manualMultiSelected = [];
    this.manualMultiEmitCount = 0;
    this.manualMultiLog = [];
  }

  onManualSingleSelectedChange(selected: User[]) {
    this.manualSingleEmitCount++;
    this.manualSingleLog.unshift(`#${this.manualSingleEmitCount}: emitted — ${selected?.[0]?.name || '(none)'}`);
    if (this.manualSingleLog.length > 20) {
      this.manualSingleLog.length = 20;
    }
  }

  selectSingleFirst() {
    this.manualSingleSelected = [this.users[0]];
  }

  selectSingleLast() {
    this.manualSingleSelected = [this.users[this.users.length - 1]];
  }

  selectSingleMiddle() {
    this.manualSingleSelected = [this.users[Math.floor(this.users.length / 2)]];
  }

  clearManualSingleSelection() {
    this.manualSingleSelected = [];
  }

  resetManualSingle() {
    this.manualSingleSelected = [];
    this.manualSingleEmitCount = 0;
    this.manualSingleLog = [];
  }

  onOneWayMultiSelectedChange(selected: User[]) {
    this.oneWayMultiSelected = selected;
    this.oneWayMultiEmitCount++;
    this.oneWayMultiLog.unshift(
      `#${this.oneWayMultiEmitCount}: emitted ${selected.length} item(s) — ${selected.map(u => u.name).join(', ') || '(none)'}`
    );
    if (this.oneWayMultiLog.length > 20) {
      this.oneWayMultiLog.length = 20;
    }
  }

  resetOneWayMulti() {
    this.oneWayMultiSelected = [];
    this.oneWayMultiEmitCount = 0;
    this.oneWayMultiLog = [];
  }

  onOneWaySingleSelectedChange(selected: User[]) {
    this.oneWaySingleSelected = selected;
    this.oneWaySingleEmitCount++;
    this.oneWaySingleLog.unshift(`#${this.oneWaySingleEmitCount}: emitted — ${selected?.[0]?.name || '(none)'}`);
    if (this.oneWaySingleLog.length > 20) {
      this.oneWaySingleLog.length = 20;
    }
  }

  resetOneWaySingle() {
    this.oneWaySingleSelected = [];
    this.oneWaySingleEmitCount = 0;
    this.oneWaySingleLog = [];
  }

  onOneWayManualMultiSelectedChange(selected: User[]) {
    this.oneWayManualMultiSelected = selected;
    this.oneWayManualMultiEmitCount++;
    this.oneWayManualMultiLog.unshift(
      `#${this.oneWayManualMultiEmitCount}: emitted ${selected.length} item(s) — ${selected.map(u => u.name).join(', ') || '(none)'}`
    );
    if (this.oneWayManualMultiLog.length > 20) {
      this.oneWayManualMultiLog.length = 20;
    }
  }

  owSelectFirst3() {
    this.oneWayManualMultiSelected = this.users.slice(0, 3);
  }

  owSelectLast3() {
    this.oneWayManualMultiSelected = this.users.slice(-3);
  }

  owSelectAll() {
    this.oneWayManualMultiSelected = [...this.users];
  }

  owClearMulti() {
    this.oneWayManualMultiSelected = [];
  }

  resetOneWayManualMulti() {
    this.oneWayManualMultiSelected = [];
    this.oneWayManualMultiEmitCount = 0;
    this.oneWayManualMultiLog = [];
  }

  onOneWayManualSingleSelectedChange(selected: User[]) {
    this.oneWayManualSingleSelected = selected;
    this.oneWayManualSingleEmitCount++;
    this.oneWayManualSingleLog.unshift(
      `#${this.oneWayManualSingleEmitCount}: emitted — ${selected?.[0]?.name || '(none)'}`
    );
    if (this.oneWayManualSingleLog.length > 20) {
      this.oneWayManualSingleLog.length = 20;
    }
  }

  owSelectSingleFirst() {
    this.oneWayManualSingleSelected = [this.users[0]];
  }

  owSelectSingleLast() {
    this.oneWayManualSingleSelected = [this.users[this.users.length - 1]];
  }

  owSelectSingleMiddle() {
    this.oneWayManualSingleSelected = [this.users[Math.floor(this.users.length / 2)]];
  }

  owClearSingle() {
    this.oneWayManualSingleSelected = [];
  }

  resetOneWayManualSingle() {
    this.oneWayManualSingleSelected = [];
    this.oneWayManualSingleEmitCount = 0;
    this.oneWayManualSingleLog = [];
  }
}

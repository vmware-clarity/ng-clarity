/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { ColumnDefinition, DatagridComponent } from '@clr/addons/datagrid';
import { ClrDatagrid } from '@clr/angular/data/datagrid';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';

interface SelectionButton {
  label: string;
  cssClass: string;
}

const MULTI_BUTTONS: SelectionButton[] = [
  { label: 'Select first 3', cssClass: 'btn-primary' },
  { label: 'Select last 3', cssClass: 'btn-primary' },
  { label: 'Select all', cssClass: 'btn-primary' },
  { label: 'Clear selection', cssClass: 'btn-warning' },
];

const SINGLE_BUTTONS: SelectionButton[] = [
  { label: 'Select first', cssClass: 'btn-primary' },
  { label: 'Select middle', cssClass: 'btn-primary' },
  { label: 'Select last', cssClass: 'btn-primary' },
  { label: 'Clear selection', cssClass: 'btn-warning' },
];

const NULL_BUTTONS: SelectionButton[] = [
  { label: 'Set to null', cssClass: 'btn-primary' },
  { label: 'Set to undefined', cssClass: 'btn-primary' },
  { label: 'Set to []', cssClass: 'btn-primary' },
];

@Component({
  selector: 'clr-datagrid-selection-sandbox-demo',
  providers: [Inventory],
  templateUrl: 'selection-sandbox.html',
  styleUrls: ['../datagrid.demo.scss'],
  standalone: false,
})
export class DatagridSelectionSandboxDemo implements OnInit {
  @ViewChild(ClrDatagrid) clrDatagrid: ClrDatagrid<User>;
  @ViewChild(DatagridComponent) appfxDatagrid: DatagridComponent<User>;

  users: User[];
  selected: User[] = [];
  emitCount = 0;
  log: string[] = [];
  datagridVisible = true;

  configForm = new FormGroup({
    useAppfx: new FormControl(false),
    selectionType: new FormControl<'none' | 'single' | 'multi'>('multi'),
    twoWayBinding: new FormControl(true),
    showManualButtons: new FormControl(false),
    noSelectedBinding: new FormControl(false),
    initWithNull: new FormControl(false),
  });

  userColumns: ColumnDefinition<User>[] = [
    { displayName: 'User ID', field: 'id' },
    { displayName: 'Name', field: 'name' },
    { displayName: 'Creation date', field: 'creation' },
  ];

  private destroyRef = inject(DestroyRef);

  constructor(
    inventory: Inventory,
    private cdr: ChangeDetectorRef
  ) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }

  get activeButtons(): SelectionButton[] {
    const { noSelectedBinding, initWithNull, showManualButtons, selectionType } = this.configForm.value;
    if (noSelectedBinding) {
      return [];
    }
    if (initWithNull) {
      return NULL_BUTTONS;
    }
    if (!showManualButtons) {
      return [];
    }
    return selectionType === 'single' ? SINGLE_BUTTONS : MULTI_BUTTONS;
  }

  ngOnInit() {
    this.configForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      if (value.initWithNull) {
        this.selected = null;
        this.emitCount = 0;
        this.log = [];
        this.recreateDatagrid();
      }
    });
  }

  onChange(selected: User[]) {
    const { noSelectedBinding, twoWayBinding, selectionType } = this.configForm.value;
    if (!noSelectedBinding && twoWayBinding) {
      this.selected = selected;
    }
    this.emitCount++;

    const summary =
      selectionType === 'single'
        ? `#${this.emitCount}: emitted — ${selected?.[0]?.name || '(none)'}`
        : `#${this.emitCount}: emitted ${selected?.length ?? 0} item(s) — ${selected?.map(u => u.name).join(', ') || '(none)'}`;

    this.log.unshift(summary);
    if (this.log.length > 20) {
      this.log.length = 20;
    }
  }

  reset() {
    this.selected = this.configForm.value.initWithNull ? null : [];
    this.emitCount = 0;
    this.log = [];
  }

  onButtonClick(button: SelectionButton) {
    switch (button.label) {
      case 'Select first 3':
        this.selected = this.users.slice(0, 3);
        break;
      case 'Select last 3':
        this.selected = this.users.slice(-3);
        break;
      case 'Select all':
        this.selected = [...this.users];
        break;
      case 'Clear selection':
        this.selected = [];
        break;
      case 'Select first':
        this.selected = [this.users[0]];
        break;
      case 'Select middle':
        this.selected = [this.users[Math.floor(this.users.length / 2)]];
        break;
      case 'Select last':
        this.selected = [this.users[this.users.length - 1]];
        break;
      case 'Set to null':
        this.selected = null;
        break;
      case 'Set to undefined':
        this.selected = undefined;
        break;
      case 'Set to []':
        this.selected = [];
        break;
    }
    this.cdr.detectChanges();
  }

  selectedDisplay(): string {
    if (this.configForm.value.selectionType === 'single') {
      return this.selected?.[0]?.name || '(none)';
    }
    return `${this.selected?.length ?? 0} item(s)`;
  }

  datagridSelection(): User[] {
    if (this.configForm.value.useAppfx) {
      return this.appfxDatagrid?.selectedItems;
    }
    return this.clrDatagrid?.selection?.current;
  }

  boundValueType(): string {
    if (this.selected === null) {
      return 'null';
    }
    if (this.selected === undefined) {
      return 'undefined';
    }
    return `Array(${this.selected.length})`;
  }

  private recreateDatagrid() {
    this.datagridVisible = false;
    setTimeout(() => {
      this.datagridVisible = true;
      this.cdr.detectChanges();
    }, 0);
  }
}

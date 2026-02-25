/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';

interface SelectionButton {
  label: string;
  cssClass: string;
}

interface SelectionScenario {
  title: string;
  sectionHeading?: string;
  description?: string;
  selectionType: 'single' | 'multi';
  twoWay: boolean;
  selected: User[];
  emitCount: number;
  log: string[];
  buttons?: SelectionButton[];
  initWithNull?: boolean;
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
  selector: 'clr-datagrid-selection-feedback-loop-demo',
  providers: [Inventory],
  templateUrl: 'selection-feedback-loop.html',
  styleUrls: ['../datagrid.demo.scss'],
  standalone: false,
})
export class DatagridSelectionFeedbackLoopDemo {
  users: User[];
  scenarios: SelectionScenario[];

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
    this.scenarios = this.buildScenarios();
  }

  onChange(scenario: SelectionScenario, selected: User[]) {
    scenario.selected = selected;
    scenario.emitCount++;

    const summary =
      scenario.selectionType === 'single'
        ? `#${scenario.emitCount}: emitted — ${selected?.[0]?.name || '(none)'}`
        : `#${scenario.emitCount}: emitted ${selected.length} item(s) — ${selected.map(u => u.name).join(', ') || '(none)'}`;

    scenario.log.unshift(summary);
    if (scenario.log.length > 20) {
      scenario.log.length = 20;
    }
  }

  reset(scenario: SelectionScenario) {
    scenario.selected = scenario.initWithNull ? null : [];
    scenario.emitCount = 0;
    scenario.log = [];
  }

  onButtonClick(scenario: SelectionScenario, button: SelectionButton) {
    switch (button.label) {
      case 'Select first 3':
        scenario.selected = this.users.slice(0, 3);
        break;
      case 'Select last 3':
        scenario.selected = this.users.slice(-3);
        break;
      case 'Select all':
        scenario.selected = [...this.users];
        break;
      case 'Clear selection':
        scenario.selected = [];
        break;
      case 'Select first':
        scenario.selected = [this.users[0]];
        break;
      case 'Select middle':
        scenario.selected = [this.users[Math.floor(this.users.length / 2)]];
        break;
      case 'Select last':
        scenario.selected = [this.users[this.users.length - 1]];
        break;
      case 'Set to null':
        scenario.selected = null;
        break;
      case 'Set to undefined':
        scenario.selected = undefined;
        break;
      case 'Set to []':
        scenario.selected = [];
        break;
    }
  }

  selectedDisplay(scenario: SelectionScenario): string {
    if (scenario.selectionType === 'single') {
      return scenario.selected?.[0]?.name || '(none)';
    }
    return `${scenario.selected?.length ?? 0} item(s)`;
  }

  boundValueType(scenario: SelectionScenario): string {
    if (scenario.selected === null) {
      return 'null';
    }
    if (scenario.selected === undefined) {
      return 'undefined';
    }
    return `Array(${scenario.selected.length})`;
  }

  private buildScenarios(): SelectionScenario[] {
    return [
      {
        title: 'Multi Selection',
        selectionType: 'multi',
        twoWay: true,
        selected: [],
        emitCount: 0,
        log: [],
      },
      {
        title: 'Single Selection',
        selectionType: 'single',
        twoWay: true,
        selected: [],
        emitCount: 0,
        log: [],
      },
      {
        title: 'Manual Multi Re-assignment (Button-driven)',
        description:
          'Tests programmatic re-assignment of [(clrDgSelected)] via buttons. Each re-assignment should emit exactly once.',
        selectionType: 'multi',
        twoWay: true,
        selected: [],
        emitCount: 0,
        log: [],
        buttons: MULTI_BUTTONS,
      },
      {
        title: 'Manual Single Re-assignment (Button-driven)',
        description:
          'Tests programmatic re-assignment of [(clrDgSelected)] with single selection via buttons. Each re-assignment should emit exactly once.',
        selectionType: 'single',
        twoWay: true,
        selected: [],
        emitCount: 0,
        log: [],
        buttons: SINGLE_BUTTONS,
      },

      {
        sectionHeading: 'One-Way Binding Tests',
        title: 'One-Way Multi Selection',
        description:
          'Uses one-way [clrDgSelected] input with a separate (clrDgSelectedChange) output that manually reassigns the variable.',
        selectionType: 'multi',
        twoWay: false,
        selected: [],
        emitCount: 0,
        log: [],
      },
      {
        title: 'One-Way Single Selection',
        selectionType: 'single',
        twoWay: false,
        selected: [],
        emitCount: 0,
        log: [],
      },
      {
        title: 'One-Way Manual Multi Re-assignment (Button-driven)',
        description: 'One-way [clrDgSelected] with multi selection and button-driven re-assignment.',
        selectionType: 'multi',
        twoWay: false,
        selected: [],
        emitCount: 0,
        log: [],
        buttons: MULTI_BUTTONS,
      },
      {
        title: 'One-Way Manual Single Re-assignment (Button-driven)',
        description: 'One-way [clrDgSelected] with single selection and button-driven re-assignment.',
        selectionType: 'single',
        twoWay: false,
        selected: [],
        emitCount: 0,
        log: [],
        buttons: SINGLE_BUTTONS,
      },

      {
        sectionHeading: 'Null/Undefined Input Tests',
        title: 'Null-Init Single Selection',
        description:
          'Tests what happens when clrDgSelected is initialized with null or set to null/undefined at runtime.',
        selectionType: 'single',
        twoWay: true,
        selected: null,
        emitCount: 0,
        log: [],
        initWithNull: true,
        buttons: NULL_BUTTONS,
      },
      {
        title: 'Null-Init Multi Selection',
        description:
          'Tests what happens when clrDgSelected is initialized with null or set to null/undefined at runtime.',
        selectionType: 'multi',
        twoWay: true,
        selected: null,
        emitCount: 0,
        log: [],
        initWithNull: true,
        buttons: NULL_BUTTONS,
      },
    ];
  }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * A step clicks an element, or types text into an input (the value is set and an `input` event dispatched).
 */
export type Step = { click: string } | { type: string; text: string };

export interface Scenario {
  name: string;
  /** The page of projects/benchmarks, with its query parameters. */
  page: string;
  /** Steps run before the measured step, not measured. */
  setup?: Step[];
  /** The measured step: from the event until the page stops changing. */
  measure: Step;
}

const bench = (action: string) => ({ click: `[data-bench="${action}"]` });

export const scenarios: Scenario[] = [
  { name: 'datagrid: render 200 rows', page: 'datagrid?size=200', measure: bench('render') },
  {
    name: 'datagrid: sort 200 rows',
    page: 'datagrid?size=200',
    setup: [bench('render')],
    measure: { click: 'clr-dg-column .datagrid-column-title' },
  },
  {
    name: 'datagrid: select all 200 rows',
    page: 'datagrid?size=200',
    setup: [bench('render')],
    measure: { click: '.datagrid-header .datagrid-select input' },
  },
  {
    name: 'datagrid: remove 200 rows',
    page: 'datagrid?size=200',
    setup: [bench('render')],
    measure: bench('clear'),
  },
  { name: 'tree-view: render 1,036 nodes', page: 'tree-view?size=4', measure: bench('render') },
  {
    name: 'tree-view: expand 1,036 nodes with [clrExpanded]',
    page: 'tree-view?size=4',
    setup: [bench('render')],
    measure: bench('expand-binding'),
  },
  {
    name: 'tree-view: expand 1,036 nodes with expandAll()',
    page: 'tree-view?size=4',
    setup: [bench('render')],
    measure: bench('expand-all'),
  },
  { name: 'combobox: open 1,000 options', page: 'combobox?size=1000', measure: { click: '.clr-combobox-trigger' } },
  {
    name: 'combobox: filter 1,000 options',
    page: 'combobox?size=1000',
    setup: [{ click: '.clr-combobox-trigger' }],
    measure: { type: '.clr-combobox-input', text: 'vm-001' },
  },
  { name: 'dropdown: open 50 items', page: 'dropdown?size=50', measure: { click: '.dropdown-toggle' } },
];

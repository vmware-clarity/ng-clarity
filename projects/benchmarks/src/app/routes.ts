/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Routes } from '@angular/router';

import { ComboboxBenchmark } from './combobox.benchmark';
import { DatagridBenchmark } from './datagrid.benchmark';
import { DropdownBenchmark } from './dropdown.benchmark';
import { TreeViewBenchmark } from './tree-view.benchmark';

/**
 * One page per component. Each page renders its component with generated data and buttons marked with
 * `data-bench` for the actions that tests/performance measures; the buttons also let you try a scenario by hand.
 */
export const routes: Routes = [
  { path: 'combobox', component: ComboboxBenchmark },
  { path: 'datagrid', component: DatagridBenchmark },
  { path: 'dropdown', component: DropdownBenchmark },
  { path: 'tree-view', component: TreeViewBenchmark },
];

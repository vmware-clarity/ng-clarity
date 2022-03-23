/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { getStatesAndCities, TreeNode } from './inventory';

const STATES_AND_CITIES = getStatesAndCities(10);

@Component({
  selector: 'clr-tree-view-type-ahead-demo',
  styleUrls: ['../tree-view.demo.scss'],
  templateUrl: './tree-view-type-ahead.html',
})
export class TypeAheadTreeViewDemo {
  synchronousChildren = (node: TreeNode) => node.children;

  multiRoot: TreeNode[] = STATES_AND_CITIES;
}

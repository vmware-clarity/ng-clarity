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

  private numberContentNode0to4 = {
    name: '0-4',
    children: [{ name: '0' }, { name: '1' }, { name: '2' }, { name: '3' }, { name: '4' }],
  };

  private numberContentNode5to9 = {
    name: '5-9',
    children: [{ name: '5' }, { name: '6' }, { name: '7' }, { name: '8' }, { name: '9' }],
  };

  private nonEnglishContentNode = {
    name: 'Україна 💙💛',
    children: [{ name: 'Севасто́поль' }, { name: 'Доне́цьк' }, { name: 'Луга́нськ' }],
  };

  multiRoot: TreeNode[] = [
    ...STATES_AND_CITIES,
    this.numberContentNode0to4,
    this.numberContentNode5to9,
    this.nonEnglishContentNode,
  ];
}

/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { getStatesAndCities, TreeNode } from './inventory';

const STATES_AND_CITIES = getStatesAndCities(10);

const numberContentNode0to4: TreeNode = {
  name: '0-4',
  children: [{ name: '0' }, { name: '1' }, { name: '2' }, { name: '3' }, { name: '4' }],
};

const numberContentNode5to9: TreeNode = {
  name: '5-9',
  children: [{ name: '5' }, { name: '6' }, { name: '7' }, { name: '8' }, { name: '9' }],
};

const nonEnglishContentNode: TreeNode = {
  name: 'Україна 💙💛',
  children: [{ name: 'Севасто́поль' }, { name: 'Доне́цьк' }, { name: 'Луга́нськ' }],
};

@Component({
  selector: 'clr-tree-view-type-ahead-demo',
  styleUrls: ['../tree-view.demo.scss'],
  templateUrl: './tree-view-type-ahead.html',
})
export class TypeAheadTreeViewDemo {
  multiRoot: TreeNode[] = [...STATES_AND_CITIES, numberContentNode0to4, numberContentNode5to9, nonEnglishContentNode];

  synchronousChildren(node: TreeNode) {
    return node.children;
  }
}

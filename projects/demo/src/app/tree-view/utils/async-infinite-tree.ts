/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSelectedState } from '@clr/angular';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { InfiniteTree } from './infinite-tree';

export class AsyncInfiniteTree {
  private tree: InfiniteTree;
  private delay: Observable<number>;

  constructor(width: number, latency = 100) {
    this.tree = new InfiniteTree(width);
    this.delay = timer(latency);
  }

  get root() {
    return this.tree.root;
  }

  get selected() {
    return this.tree.selected;
  }

  isSelected(node: string): ClrSelectedState {
    return this.tree.isSelected(node);
  }

  select(node: string, state: ClrSelectedState): void {
    return this.tree.select(node, state);
  }

  fetchChildren(node: string): Observable<string[]> {
    return this.delay.pipe(map(() => this.tree.getChildren(node)));
  }
}

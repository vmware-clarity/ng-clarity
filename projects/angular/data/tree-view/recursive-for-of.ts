/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Directive, Input, OnChanges, OnDestroy, TemplateRef } from '@angular/core';

import { AsyncArray } from './models/async-array';
import { RecursiveTreeNodeModel } from './models/recursive-tree-node.model';
import { TreeNodeModel } from './models/tree-node.model';
import { TreeFeaturesService } from './tree-features.service';

export interface ClrRecursiveForOfContext<T> {
  $implicit: T;
  clrModel: TreeNodeModel<T>;
}

@Directive({
  selector: '[clrRecursiveFor][clrRecursiveForOf]',
  standalone: false,
})
export class ClrRecursiveForOf<T> implements OnChanges, OnDestroy {
  // TODO: accept NgIterable<T>
  @Input('clrRecursiveForOf') nodes!: T | T[];

  /**
   * Called to get the children of a node. The children of a node are fetched once, when the node first reads them,
   * and again only after the node is collapsed (lazy trees) or new root nodes are set. The function is not tracked:
   * a signal that it reads does not refresh the tree, so set new `clrRecursiveForOf` nodes to refetch.
   */
  // TODO: accept NgIterable<T> return type
  @Input('clrRecursiveForGetChildren') getChildren!: (node: T) => AsyncArray<T>;

  constructor(
    private template: TemplateRef<ClrRecursiveForOfContext<T>>,
    private featuresService: TreeFeaturesService<T>,
    /** @deprecated No longer used. Kept so that subclasses calling `super()` keep compiling. To be removed in a future major version. */
    _cdr?: ChangeDetectorRef
  ) {}

  // I'm using OnChanges instead of OnInit to easily keep up to date with dynamic trees. Maybe optimizable later.
  ngOnChanges() {
    let wrapped: RecursiveTreeNodeModel<T>[];
    if (Array.isArray(this.nodes)) {
      wrapped = this.nodes.map(node => new RecursiveTreeNodeModel(node, null, this.getChildren));
    } else {
      wrapped = [new RecursiveTreeNodeModel(this.nodes, null, this.getChildren)];
    }
    this.featuresService.recursion = {
      template: this.template,
      root: wrapped,
    };
  }

  /** @deprecated No longer needed, there is nothing to clean up. To be removed in a future major version. */
  ngOnDestroy() {
    // Intentionally empty.
  }
}

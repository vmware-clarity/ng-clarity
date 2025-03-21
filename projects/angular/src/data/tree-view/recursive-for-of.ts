/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Directive, Input, OnChanges, OnDestroy, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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
})
export class ClrRecursiveForOf<T> implements OnChanges, OnDestroy {
  // TODO: accept NgIterable<T>
  @Input('clrRecursiveForOf') nodes: T | T[];

  // TODO: accept NgIterable<T> return type
  @Input('clrRecursiveForGetChildren') getChildren: (node: T) => AsyncArray<T>;

  private childrenFetchSubscription: Subscription;

  constructor(
    private template: TemplateRef<ClrRecursiveForOfContext<T>>,
    private featuresService: TreeFeaturesService<T>,
    private cdr: ChangeDetectorRef
  ) {}

  // I'm using OnChanges instead of OnInit to easily keep up to date with dynamic trees. Maybe optimizable later.
  ngOnChanges() {
    let wrapped: RecursiveTreeNodeModel<T>[];
    if (Array.isArray(this.nodes)) {
      wrapped = this.nodes.map(node => new RecursiveTreeNodeModel(node, null, this.getChildren, this.featuresService));
    } else {
      wrapped = [new RecursiveTreeNodeModel(this.nodes, null, this.getChildren, this.featuresService)];
    }
    if (!this.childrenFetchSubscription) {
      this.childrenFetchSubscription = this.featuresService.childrenFetched.pipe(debounceTime(0)).subscribe(() => {
        this.cdr.detectChanges();
      });
    }

    this.featuresService.recursion = {
      template: this.template,
      root: wrapped,
    };
  }

  ngOnDestroy() {
    if (this.childrenFetchSubscription) {
      this.childrenFetchSubscription.unsubscribe();
    }
  }
}

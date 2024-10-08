/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DomPortal } from '@angular/cdk/portal';
import { Injectable, Optional, SkipSelf, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';

import { RecursiveTreeNodeModel } from './models/recursive-tree-node.model';
import { ClrRecursiveForOfContext } from './recursive-for-of';

export interface PortalKeeper {
  position: number;
  portal: DomPortal;
}

@Injectable()
export class TreeFeaturesService<T> {
  selectable = false;
  eager = true;
  flat = false;
  rawPortals: PortalKeeper[] = [];

  recursion: {
    template: TemplateRef<ClrRecursiveForOfContext<T>>;
    root: RecursiveTreeNodeModel<T>[];
  };

  childrenFetched = new Subject<void>();

  get portals() {
    return this.rawPortals.sort((a, b) => a.position - b.position).map(portal => portal.portal);
  }
}

export function treeFeaturesFactory<T>(existing: TreeFeaturesService<T>) {
  return existing || new TreeFeaturesService();
}

export const TREE_FEATURES_PROVIDER = {
  provide: TreeFeaturesService,
  useFactory: treeFeaturesFactory,
  /*
   * The Optional + SkipSelf pattern ensures that in case of nested components, only the root one will
   * instantiate a new service and all its children will reuse the root's instance.
   * If there are several roots (in this case, several independent trees on a page), each root will instantiate
   * its own service so they won't interfere with one another.
   *
   * TL;DR - Optional + SkipSelf = 1 instance of TreeFeaturesService per tree.
   */
  deps: [[new Optional(), new SkipSelf(), TreeFeaturesService]],
};

/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { angleIcon, ClarityIcons } from '@cds/core/icon';

import { ClrIconModule } from '../../icon/icon.module';
import { ClrLoadingModule } from '../../utils/loading/loading.module';
import { RecursiveChildren } from './recursive-children';
import { ClrRecursiveForOf } from './recursive-for-of';
import { ClrTree } from './tree';
import { ClrTreeNode } from './tree-node';
import { ClrTreeNodeLink } from './tree-node-link';

export const CLR_TREE_VIEW_DIRECTIVES: Type<any>[] = [ClrTree, ClrTreeNode, ClrRecursiveForOf, ClrTreeNodeLink];

@NgModule({
  imports: [CommonModule, ClrIconModule, ClrLoadingModule],
  declarations: [CLR_TREE_VIEW_DIRECTIVES, RecursiveChildren],
  exports: [CLR_TREE_VIEW_DIRECTIVES],
})
export class ClrTreeViewModule {
  constructor() {
    ClarityIcons.addIcons(angleIcon);
  }
}

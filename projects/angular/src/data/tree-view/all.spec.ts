/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import DeclarativeTreeNodeModelSpecs from './models/declarative-tree-node.model.spec';
import RecursiveTreeNodeModelSpecs from './models/recursive-tree-node.model.spec';
import TreeNodeModelSpecs from './models/tree-node.model.spec';
import RecursiveChildrenSpecs from './recursive-children.spec';
import RecursiveForOfSpecs from './recursive-for-of.spec';
import TreeFocusManagerSpecs from './tree-focus-manager.service.spec';
import TreeNodeSpec from './tree-node.spec';
import TreeSpecs from './tree.spec';

describe('Tree View', () => {
  describe('Models', () => {
    TreeNodeModelSpecs();
    DeclarativeTreeNodeModelSpecs();
    RecursiveTreeNodeModelSpecs();
  });

  describe('Components', () => {
    TreeNodeSpec();
    TreeSpecs();
    RecursiveForOfSpecs();
    RecursiveChildrenSpecs();
  });

  describe('Services', () => {
    TreeFocusManagerSpecs();
  });
});

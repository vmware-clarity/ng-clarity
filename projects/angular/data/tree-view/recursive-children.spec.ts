/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, TemplateRef, ViewChild } from '@angular/core';
import { spec, TestContext } from '@clr/angular/testing';
import { IfExpandService } from '@clr/angular/utils';

import { RecursiveTreeNodeModel } from './models/recursive-tree-node.model';
import { RecursiveChildren } from './recursive-children';
import { ClrRecursiveForOfContext } from './recursive-for-of';
import { TreeFeaturesService } from './tree-features.service';

/*
 * Some utilities for this spec
 */

interface TestNode {
  name: string;
  children?: TestNode[];
}

function getChildren(node: TestNode) {
  return node.children;
}

@Component({
  template: `
    <clr-recursive-children [parent]="parent" [children]="children"></clr-recursive-children>
    <ng-template #template let-node>{{ node.name }}</ng-template>
  `,
  standalone: false,
})
class TestComponent {
  @ViewChild('template') template: TemplateRef<ClrRecursiveForOfContext<TestNode>>;

  parent: RecursiveTreeNodeModel<TestNode>;
  children: RecursiveTreeNodeModel<TestNode>[];
}

describe('Tree View', () => {
  describe('Components', () => {
    describe('RecursiveChildren Component', () => {
      let testContext: Context;

      let TEST_ROOT: RecursiveTreeNodeModel<TestNode>;
      type Context = TestContext<RecursiveChildren<TestNode>, TestComponent> & {
        featuresService: TreeFeaturesService<TestNode>;
        expandService: IfExpandService;
      };
      const getContext = spec(RecursiveChildren, TestComponent, undefined, {
        providers: [TreeFeaturesService, IfExpandService],
      });
      beforeEach(() => {
        testContext = getContext() as Context;
      });

      beforeEach(() => {
        testContext.featuresService =
          testContext.getClarityProvider<TreeFeaturesService<TestNode>>(TreeFeaturesService);
        testContext.expandService = testContext.getClarityProvider(IfExpandService);
        TEST_ROOT = new RecursiveTreeNodeModel(
          {
            name: 'root',
            children: [
              { name: 'A', children: [{ name: 'AA' }, { name: 'AB' }] },
              { name: 'B', children: [{ name: 'BA' }, { name: 'BB' }] },
              { name: 'C' },
            ],
          },
          null,
          getChildren,
          testContext.featuresService
        );
        testContext.featuresService.recursion = {
          template: testContext.testComponent.template,
          root: [TEST_ROOT],
        };
        testContext.testComponent.parent = TEST_ROOT;
        testContext.detectChanges();
      });

      it('can create a ClrRecursiveForOfContext for a node', () => {
        expect(testContext.clarityDirective.getContext(TEST_ROOT)).toEqual({
          $implicit: TEST_ROOT.model,
          clrModel: TEST_ROOT,
        });
      });

      it('keeps one context object per node across change detection passes', () => {
        // A new object on every pass would make ngTemplateOutlet run ngOnChanges for every node on every pass.
        expect(testContext.clarityDirective.getContext(TEST_ROOT)).toBe(
          testContext.clarityDirective.getContext(TEST_ROOT)
        );
      });

      it('renders the current model of a node even after it gets reassigned', () => {
        TEST_ROOT.children[0].model = { name: 'Renamed' };
        testContext.detectChanges();
        expect(testContext.clarityElement.textContent).toMatch(/Renamed\s*B\s*C/);
      });

      it('does not render anything if the tree is not recursive', () => {
        delete testContext.featuresService.recursion;
        testContext.detectChanges();
        expect(testContext.clarityElement.textContent.trim()).toBe('');
      });

      it('renders children if the tree is eager', () => {
        expect(testContext.clarityElement.textContent).toMatch(/A\s*B\s*C/);
      });

      it('does not render anything if the tree is lazy and the parent is collapsed', () => {
        testContext.featuresService.eager = false;
        testContext.detectChanges();
        expect(testContext.clarityElement.textContent.trim()).toBe('');
      });

      it('renders children if the tree is lazy and the parent is expanded', () => {
        testContext.featuresService.eager = false;
        testContext.expandService.expanded = true;
        testContext.detectChanges();
        expect(testContext.clarityElement.textContent).toMatch(/A\s*B\s*C/);
      });

      it('renders children even if there is no parent', () => {
        delete testContext.testComponent.parent;
        testContext.testComponent.children = TEST_ROOT.children;
        testContext.detectChanges();
        expect(testContext.clarityElement.textContent).toMatch(/A\s*B\s*C/);
      });

      it('does not destroy the children when he parent becomes collapsed if the tree is eager', () => {
        const spy = vi.spyOn(testContext.testComponent.parent, 'clearChildren').mockImplementation(() => undefined);
        testContext.expandService.expanded = true;
        expect(spy).not.toHaveBeenCalled();
        testContext.expandService.expanded = false;
        expect(spy).not.toHaveBeenCalled();
      });

      it('destroys the children when he parent becomes collapsed if the tree is lazy', () => {
        testContext.featuresService.eager = false;
        const spy = vi.spyOn(testContext.testComponent.parent, 'clearChildren').mockImplementation(() => undefined);
        testContext.expandService.expanded = true;
        expect(spy).not.toHaveBeenCalled();
        testContext.expandService.expanded = false;
        expect(spy).toHaveBeenCalled();
      });

      // Just like other specs, this is not nearly as exhaustive as I would like it to be due to time constraints.
    });
  });
});

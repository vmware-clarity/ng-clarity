/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { renderFixture } from '@clr/angular/utils/testing';

import { RecursiveTreeNodeModel } from './models/recursive-tree-node.model';
import { ClrRecursiveForOf, ClrRecursiveForOfContext } from './recursive-for-of';
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

const TEST_ROOT: TestNode = {
  name: 'root',
  children: [
    { name: 'A', children: [{ name: 'AA' }, { name: 'AB' }] },
    { name: 'B', children: [{ name: 'BA' }, { name: 'BB' }] },
    { name: 'C' },
  ],
};

@Component({
  template: `<div *clrRecursiveFor="let node of root; getChildren: getChildren"></div>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TestComponent {
  @ViewChild(ClrRecursiveForOf) recursiveForOf: ClrRecursiveForOf<TestNode>;
  @ViewChild(TemplateRef) template: TemplateRef<ClrRecursiveForOfContext<TestNode>>;

  root: TestNode | TestNode[] = TEST_ROOT;
  getChildren = getChildren;
}

interface Context {
  fixture: ComponentFixture<TestComponent>;
  testComponent: TestComponent;
  clarityDirective: ClrRecursiveForOf<TestNode>;
  featuresService: TreeFeaturesService<TestNode>;
}

describe('Tree View', () => {
  describe('Components', () => {
    describe('RecursiveChildren Component', () => {
      let testContext: Context;
      beforeEach(() => {
        testContext = {} as Context;
      });

      // Can't use our helpers in their current state because it's a structural directive
      beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [ClrRecursiveForOf, TestComponent],
          providers: [TreeFeaturesService],
        });
        testContext.fixture = TestBed.createComponent(TestComponent);
        renderFixture(testContext.fixture);
        testContext.testComponent = testContext.fixture.componentInstance;
        testContext.clarityDirective = testContext.fixture.componentInstance.recursiveForOf;
        testContext.featuresService = TestBed.inject(TreeFeaturesService);
      });

      it('accepts a [clrRecursiveForOf] input', () => {
        expect(testContext.clarityDirective.nodes).toBe(TEST_ROOT);
      });

      it('accepts a [clrRecursiveForOfGetChildren] input', () => {
        expect(testContext.clarityDirective.getChildren).toBe(getChildren);
      });

      it('initializes the recursion service with the correct values', () => {
        expect(testContext.featuresService.recursion).toBeTruthy();
        expect(testContext.featuresService.recursion.template.elementRef.nativeElement).toBe(
          testContext.testComponent.template.elementRef.nativeElement
        );
        expect(testContext.featuresService.recursion.root).toEqual([
          new RecursiveTreeNodeModel(TEST_ROOT, null, getChildren, testContext.featuresService),
        ]);
      });

      it('updates the recursion service if the nodes change', () => {
        testContext.testComponent.root = TEST_ROOT.children[0];
        renderFixture(testContext.fixture);
        expect(testContext.featuresService.recursion.root).toEqual([
          new RecursiveTreeNodeModel(TEST_ROOT.children[0], null, getChildren, testContext.featuresService),
        ]);
      });

      it('refreshes the tree once per burst of fetched children, in a microtask', async () => {
        vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
        // Children fetched while the tree renders arrive in bursts, one notification per node.
        const detectChanges = vi
          .spyOn((testContext.clarityDirective as any).cdr, 'detectChanges')
          .mockImplementation(() => undefined);
        for (let i = 0; i < 5; i++) {
          testContext.featuresService.childrenFetched.next();
        }
        expect(detectChanges).not.toHaveBeenCalled();
        // A microtask is enough: no timer, and so no separate change detection pass per burst.
        await Promise.resolve();
        expect(detectChanges).toHaveBeenCalledTimes(1);
      });

      it('accepts multiple roots', () => {
        testContext.testComponent.root = [TEST_ROOT, TEST_ROOT];
        renderFixture(testContext.fixture);
        const wrappedRoot = new RecursiveTreeNodeModel(TEST_ROOT, null, getChildren, testContext.featuresService);
        expect(testContext.featuresService.recursion.root).toEqual([wrappedRoot, wrappedRoot]);
      });
    });
  });
});

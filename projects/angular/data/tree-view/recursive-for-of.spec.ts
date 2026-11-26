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

      function expectRoots(nodes: TestNode[]) {
        const roots = testContext.featuresService.recursion.root;
        expect(roots.every(root => root instanceof RecursiveTreeNodeModel && root.parent === null)).toBe(true);
        expect(roots.map(root => root.model)).toEqual(nodes);
        expect(roots.map(root => root.children.map(child => child.model))).toEqual(nodes.map(node => node.children));
      }

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
        expectRoots([TEST_ROOT]);
      });

      it('updates the recursion service if the nodes change', () => {
        testContext.testComponent.root = TEST_ROOT.children[0];
        renderFixture(testContext.fixture);
        expectRoots([TEST_ROOT.children[0]]);
      });

      it('keeps accepting the deprecated ChangeDetectorRef constructor argument and ngOnDestroy', () => {
        const template = testContext.testComponent.template;
        const directive = new ClrRecursiveForOf<TestNode>(template, testContext.featuresService, undefined);
        expect(directive).toBeTruthy();
        expect(() => directive.ngOnDestroy()).not.toThrow();
      });

      it('accepts multiple roots', () => {
        testContext.testComponent.root = [TEST_ROOT, TEST_ROOT];
        renderFixture(testContext.fixture);
        expectRoots([TEST_ROOT, TEST_ROOT]);
      });
    });
  });
});

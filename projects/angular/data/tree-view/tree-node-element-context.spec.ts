/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CLR_ELEMENT_CONTEXT_PROPERTY, ClrContextSnapshotOptions, ClrElementContextCallback } from '@clr/angular/utils';

import { ClrTreeViewModule } from './tree-view.module';

const BUDGETS: Required<ClrContextSnapshotOptions> = {
  maxTextLength: 100,
  maxItemsPerCollection: 25,
  maxComponents: 100,
  includeDomComponents: true,
  includeText: true,
  includeFrames: true,
};

function publishedOn(element: Element): Record<string, unknown> {
  const callback = (element as Element & { [CLR_ELEMENT_CONTEXT_PROPERTY]?: ClrElementContextCallback })[
    CLR_ELEMENT_CONTEXT_PROPERTY
  ];
  if (!callback) {
    throw new Error('expected an element context callback to be published');
  }
  return (callback(BUDGETS)?.state ?? {}) as Record<string, unknown>;
}

@Component({
  template: `
    <clr-tree>
      <clr-tree-node [clrExpandable]="true">Datacenters</clr-tree-node>
      <clr-tree-node>Standalone host</clr-tree-node>
    </clr-tree>
  `,
  standalone: false,
})
class TestComponent {}

describe('ClrTreeNode element context', () => {
  let fixture: ComponentFixture<TestComponent>;

  function nodes(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('clr-tree-node'));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrTreeViewModule, NoopAnimationsModule],
      declarations: [TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('publishes that a collapsed node has children, which are not in the DOM to be found', () => {
    // aria-expanded="false" says collapsed. It cannot say whether anything is under it.
    expect(publishedOn(nodes()[0]).expandable).toBe(true);
  });

  it('publishes that a leaf node has nothing under it', () => {
    expect(publishedOn(nodes()[1]).expandable).toBe(false);
  });

  it('publishes nothing about loading while the node is idle', () => {
    expect('loading' in publishedOn(nodes()[0])).toBe(false);
  });

  it('stops publishing once the node is destroyed', () => {
    const node = nodes()[0];
    fixture.destroy();

    expect(CLR_ELEMENT_CONTEXT_PROPERTY in node).toBe(false);
  });
});

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { publishedState } from '@clr/angular/testing';
import { CLR_ELEMENT_CONTEXT_PROPERTY } from '@clr/angular/utils';
import { Observable } from 'rxjs';

import { ClrTreeViewModule } from './tree-view.module';

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
    expect(publishedState(nodes()[0]).expandable).toBe(true);
  });

  it('publishes that a leaf node has nothing under it', () => {
    expect(publishedState(nodes()[1]).expandable).toBe(false);
  });

  it('publishes nothing about loading while the node is idle', () => {
    expect('loading' in publishedState(nodes()[0])).toBe(false);
  });

  it('stops publishing once the node is destroyed', () => {
    const node = nodes()[0];
    fixture.destroy();

    expect(CLR_ELEMENT_CONTEXT_PROPERTY in node).toBe(false);
  });
});

@Component({
  template: `
    <clr-tree>
      <clr-tree-node *clrRecursiveFor="let item of roots; getChildren: getChildren" [clrExpanded]="true">
        {{ item }}
      </clr-tree-node>
    </clr-tree>
  `,
  standalone: false,
})
class LazyTestComponent {
  roots = ['Datacenters'];
  // Children that never arrive: the node stays in its loading state.
  getChildren = (): Observable<string[]> => new Observable<string[]>(() => undefined);
}

describe('ClrTreeNode element context while children load', () => {
  it('publishes that the children are still loading, which the DOM cannot show', async () => {
    TestBed.configureTestingModule({
      imports: [ClrTreeViewModule, NoopAnimationsModule],
      declarations: [LazyTestComponent],
    });
    const fixture = TestBed.createComponent(LazyTestComponent);
    fixture.detectChanges();
    // The loading flag is debounced by a tick.
    await new Promise(resolve => setTimeout(resolve));
    fixture.detectChanges();

    const state = publishedState(fixture.nativeElement.querySelector('clr-tree-node'));
    expect(state.loading).toBe(true);
    fixture.destroy();
  });
});

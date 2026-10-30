/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  provideCheckNoChangesConfig,
  provideZoneChangeDetection,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs';

import { ClrTreeNode } from './tree-node';

import { ClrTreeViewModule } from './tree-view.module';

interface Node {
  name: string;
  children?: Node[];
}

@Component({
  template: `
    @if (show()) {
      <clr-tree [clrLazy]="true">
        <clr-tree-node *clrRecursiveFor="let node of roots; getChildren: getChildren" [clrExpandable]="!!node.children">
          {{ node.name }}
        </clr-tree-node>
      </clr-tree>
    }
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TreeHost {
  readonly show = signal(true);
  readonly roots: Node[] = [{ name: 'root', children: [{ name: 'child' }] }];
  kind: 'observable' | 'promise' = 'observable';
  completeRequest: () => void;
  cancellations = 0;
  requests = 0;

  readonly getChildren = (node: Node): Observable<Node[]> | Promise<Node[]> => {
    this.requests++;
    if (this.kind === 'promise') {
      return new Promise(resolve => (this.completeRequest = () => resolve(node.children || [])));
    }
    return new Observable(subscriber => {
      this.completeRequest = () => subscriber.next(node.children || []);
      return () => this.cancellations++;
    });
  };
}

for (const zoneless of [true, false]) {
  describe(`recursive tree in a ${zoneless ? 'zoneless' : 'zone-based'} OnPush host`, () => {
    let fixture: ComponentFixture<TreeHost>;
    let host: TreeHost;

    beforeEach(async () => {
      TestBed.configureTestingModule({
        declarations: [TreeHost],
        imports: [ClrTreeViewModule],
        providers: [
          zoneless ? provideZonelessChangeDetection() : provideZoneChangeDetection(),
          provideCheckNoChangesConfig({ exhaustive: true }),
        ],
      });
      fixture = TestBed.createComponent(TreeHost);
      host = fixture.componentInstance;
      fixture.autoDetectChanges();
      await fixture.whenStable();
    });

    afterEach(() => fixture.destroy());

    async function open() {
      fixture.nativeElement.querySelector('.clr-treenode-caret').click();
      await fixture.whenStable();
      expect(host.requests).toBe(1);
      expect(fixture.nativeElement.querySelector('.clr-treenode-spinner')).not.toBeNull();
    }

    async function completeOutsideAngular() {
      // A native callback must notify Angular by itself, even when Zone.js is available.
      await TestBed.inject(NgZone).runOutsideAngular(
        () =>
          new Promise<void>(resolve =>
            setTimeout(() => {
              host.completeRequest();
              // Let the Promise reaction and debounced loading notification settle.
              setTimeout(resolve);
            })
          )
      );
      await fixture.whenStable();
    }

    for (const kind of ['observable', 'promise'] as const) {
      it(`renders ${kind} children and clears loading after a native callback`, async () => {
        host.kind = kind;
        await open();
        await completeOutsideAngular();
        expect(fixture.nativeElement.querySelectorAll('clr-tree-node').length).toBe(2);
        expect(fixture.nativeElement.textContent).toContain('child');
        expect(fixture.nativeElement.querySelector('.clr-treenode-spinner')).toBeNull();
      });
    }

    it('unsubscribes pending observable work when the tree is destroyed', async () => {
      await open();
      host.show.set(false);
      await fixture.whenStable();
      expect(host.cancellations).toBe(1);
      await completeOutsideAngular();
      expect(fixture.nativeElement.querySelector('clr-tree')).toBeNull();
    });

    it('ignores promise completion after the tree is destroyed', async () => {
      host.kind = 'promise';
      await open();
      const model = fixture.debugElement.query(By.directive(ClrTreeNode)).componentInstance._model;
      const children = model._loadedChildren;
      const loading = spyOn(model.loading$, 'next').and.callThrough();
      host.show.set(false);
      await fixture.whenStable();
      loading.calls.reset();
      await completeOutsideAngular();
      expect(model._loadedChildren).toBe(children);
      expect(loading).not.toHaveBeenCalled();
      expect(fixture.nativeElement.querySelector('clr-tree')).toBeNull();
    });
  });
}

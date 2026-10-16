/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { delay } from '@clr/angular/testing';
import { Observable, of } from 'rxjs';
import { delay as rxDelay } from 'rxjs/operators';

import { RecursiveTreeNodeModel } from './recursive-tree-node.model';

function synchronousChildren(node: string): string[] {
  return [node + 'A', node + 'B'];
}

function promiseChildren(node: string): Promise<string[]> {
  return Promise.resolve(synchronousChildren(node));
}

function observableChildren(node: string): Observable<string[]> {
  return of(synchronousChildren(node));
}

export default function (): void {
  describe('RecursiveTreeNodeModel', () => {
    let testContext: any;
    beforeEach(() => {
      testContext = {};
    });

    it('fetches children through the given function', () => {
      const root = new RecursiveTreeNodeModel('A', null, synchronousChildren, testContext.featureService);
      expect(root.children.map(c => c.model)).toEqual(['AA', 'AB']);
    });

    it('offers a fetchChildren() method that fetches the children only once', () => {
      let nbFetch = 0;
      const root = new RecursiveTreeNodeModel(
        'A',
        null,
        node => {
          nbFetch++;
          return synchronousChildren(node);
        },
        testContext.featureService
      );
      expect(nbFetch).toBe(0);
      root.fetchChildren();
      expect(nbFetch).toBe(1);
      root.fetchChildren();
      expect(nbFetch).toBe(1);
    });

    it('offers a clearChildren() method that forces the children to be fetched again next time', () => {
      let nbFetch = 0;
      const root = new RecursiveTreeNodeModel(
        'A',
        null,
        node => {
          nbFetch++;
          return synchronousChildren(node);
        },
        testContext.featureService
      );
      root.fetchChildren();
      expect(nbFetch).toBe(1);
      root.clearChildren();
      root.fetchChildren();
      expect(nbFetch).toBe(2);
    });

    it('declares itself as parent for created children', () => {
      const root = new RecursiveTreeNodeModel('A', null, synchronousChildren, testContext.featureService);
      expect(root.children.map(c => c.parent)).toEqual([root, root]);
    });

    it('can unwrap a Promise for the children', async () => {
      const root = new RecursiveTreeNodeModel('A', null, promiseChildren, testContext.featureService);
      root.fetchChildren();
      await delay();
      expect(root.children.map(c => c.model)).toEqual(['AA', 'AB']);
    });
    it('can unwrap an Observable for the children', () => {
      const root = new RecursiveTreeNodeModel('A', null, observableChildren, testContext.featureService);
      expect(root.children.map(c => c.model)).toEqual(['AA', 'AB']);
    });

    it('marks itself as loading while waiting for children from a Promise', async () => {
      const root = new RecursiveTreeNodeModel('A', null, promiseChildren, testContext.featureService);
      root.fetchChildren();
      expect(root.loading).toBeTrue();
      await delay();
      expect(root.loading).toBeFalse();
    });
    it('marks itself as loading while waiting for children from an Observable', async () => {
      const root = new RecursiveTreeNodeModel(
        'A',
        null,
        node => observableChildren(node).pipe(rxDelay(0)),
        testContext.featureService
      );
      root.fetchChildren();
      expect(root.loading).toBeTrue();
      await delay();
      expect(root.loading).toBeFalse();
    });
  });
}

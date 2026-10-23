/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComponentContext } from '@clr/angular/utils';

import { ContextRefRegistryService } from './context-ref-registry.service';

/** Hands out a ref for every node noted, bound or not, so that the bookkeeping can be looked at alone. */
const anything = () => true;

describe('ContextRefRegistryService', () => {
  let registry: ContextRefRegistryService;
  let input: HTMLInputElement;
  let host: HTMLElement;

  beforeEach(() => {
    registry = new ContextRefRegistryService();
    input = document.createElement('input');
    host = document.createElement('clr-combobox');
    host.appendChild(input);
    document.body.appendChild(host);
  });

  afterEach(() => {
    host.remove();
  });

  it('gives a node a random ref and resolves it to the element once committed', () => {
    const sink = registry.begin(anything);
    const node: ClrComponentContext = { type: 'textbox' };

    sink.note(node, input);
    expect(node.ref).toMatch(/^e[0-9a-z]{8}$/);
    expect(registry.resolve(node.ref as string)).toBeNull();

    sink.commit();
    expect(registry.resolve(node.ref as string)).toEqual({ elements: [input], type: 'textbox', label: undefined });
  });

  it('keeps the same ref for the same element across snapshots', () => {
    const first = registry.begin(anything);
    const node: ClrComponentContext = { type: 'textbox' };
    first.note(node, input);
    first.commit();

    const second = registry.begin(anything);
    const again: ClrComponentContext = { type: 'textbox' };
    second.note(again, input);
    second.commit();

    expect(again.ref).toBe(node.ref);
  });

  it('gives different elements refs that cannot be derived from one another', () => {
    const sink = registry.begin(anything);
    const refs = Array.from({ length: 20 }, () => {
      const node: ClrComponentContext = { type: 'textbox' };
      sink.note(node, document.createElement('input'));
      return node.ref;
    });
    expect(new Set(refs).size).toBe(20);
  });

  it('records the host that renders a node ahead of the element inside it, as the node ends up', () => {
    const sink = registry.begin(anything);
    const node: ClrComponentContext = { type: 'combobox' };

    sink.note(node, input);
    sink.note({ ...node, label: 'Cluster' }, host);
    sink.commit();

    expect(registry.resolve(node.ref as string)).toEqual({
      elements: [host, input],
      type: 'combobox',
      label: 'Cluster',
    });
  });

  it('still resolves a ref after a later snapshot that did not show its element', () => {
    const first = registry.begin(anything);
    const node: ClrComponentContext = { type: 'textbox' };
    first.note(node, input);
    first.commit();

    const narrower = registry.begin(anything);
    narrower.note({ type: 'checkbox' }, document.createElement('input'));
    narrower.commit();

    expect(registry.resolve(node.ref as string)?.elements).toEqual([input]);
  });

  it('stops resolving a ref once its element leaves the document', () => {
    const sink = registry.begin(anything);
    const node: ClrComponentContext = { type: 'textbox' };
    sink.note(node, input);
    sink.commit();

    host.remove();

    expect(registry.resolve(node.ref as string)).toBeNull();
  });

  it('records nothing from a walk that is never committed', () => {
    const sink = registry.begin(anything);
    const node: ClrComponentContext = { type: 'textbox' };
    sink.note(node, input);

    expect(registry.resolve(node.ref as string)).toBeNull();
  });

  it('takes the ref off a node the engine could not write through, in the tree the walk produced', () => {
    const sink = registry.begin();
    const node: ClrComponentContext = { type: 'textbox', label: 'Loose' };
    const tree: ClrComponentContext[] = [{ type: 'form', children: [node] }];

    sink.note(node, input);
    sink.commit(tree);

    expect(tree[0].children?.[0]).toEqual({ type: 'textbox', label: 'Loose' });
  });

  it('hands out no ref for an element behind an open modal dialog, and does for one inside it', () => {
    const dialog = document.createElement('div');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    const inside = document.createElement('input');
    dialog.appendChild(inside);
    document.body.appendChild(dialog);
    try {
      const sink = registry.begin(anything);
      const behind: ClrComponentContext = { type: 'textbox' };
      const front: ClrComponentContext = { type: 'textbox' };
      sink.note(behind, input);
      sink.note(front, inside);
      const behindRef = behind.ref as string;
      sink.commit([behind, front]);

      expect(behind.ref).toBeUndefined();
      expect(registry.resolve(behindRef)).toBeNull();
      expect(registry.resolve(front.ref as string)?.elements).toEqual([inside]);
    } finally {
      dialog.remove();
    }
  });
});

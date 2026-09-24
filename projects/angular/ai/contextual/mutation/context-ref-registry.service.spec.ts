/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComponentContext } from '@clr/angular/utils';

import { ContextRefRegistryService } from './context-ref-registry.service';

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
    const sink = registry.begin();
    const node: ClrComponentContext = { type: 'textbox' };

    sink.note(node, input);
    expect(node.ref).toMatch(/^e[0-9a-z]{8}$/);
    expect(registry.resolve(node.ref as string)).toBeNull();

    sink.commit();
    expect(registry.resolve(node.ref as string)).toEqual({ elements: [input], type: 'textbox', label: undefined });
  });

  it('keeps the same ref for the same element across snapshots', () => {
    const first = registry.begin();
    const node: ClrComponentContext = { type: 'textbox' };
    first.note(node, input);
    first.commit();

    const second = registry.begin();
    const again: ClrComponentContext = { type: 'textbox' };
    second.note(again, input);
    second.commit();

    expect(again.ref).toBe(node.ref);
  });

  it('gives different elements refs that cannot be derived from one another', () => {
    const sink = registry.begin();
    const refs = Array.from({ length: 20 }, () => {
      const node: ClrComponentContext = { type: 'textbox' };
      sink.note(node, document.createElement('input'));
      return node.ref;
    });
    expect(new Set(refs).size).toBe(20);
  });

  it('records the host that renders a node ahead of the element inside it, as the node ends up', () => {
    const sink = registry.begin();
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
    const first = registry.begin();
    const node: ClrComponentContext = { type: 'textbox' };
    first.note(node, input);
    first.commit();

    const narrower = registry.begin();
    narrower.note({ type: 'checkbox' }, document.createElement('input'));
    narrower.commit();

    expect(registry.resolve(node.ref as string)?.elements).toEqual([input]);
  });

  it('stops resolving a ref once its element leaves the document', () => {
    const sink = registry.begin();
    const node: ClrComponentContext = { type: 'textbox' };
    sink.note(node, input);
    sink.commit();

    host.remove();

    expect(registry.resolve(node.ref as string)).toBeNull();
  });

  it('records nothing from a walk that is never committed', () => {
    const sink = registry.begin();
    const node: ClrComponentContext = { type: 'textbox' };
    sink.note(node, input);

    expect(registry.resolve(node.ref as string)).toBeNull();
  });
});

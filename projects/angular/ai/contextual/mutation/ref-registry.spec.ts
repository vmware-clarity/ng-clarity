/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComponentContext } from '@clr/angular/utils';

import { ClrContextRefRegistry } from './ref-registry';

describe('ClrContextRefRegistry', () => {
  let registry: ClrContextRefRegistry;
  let input: HTMLInputElement;
  let host: HTMLElement;

  beforeEach(() => {
    registry = new ClrContextRefRegistry();
    input = document.createElement('input');
    host = document.createElement('clr-combobox');
    host.appendChild(input);
  });

  it('gives a node a ref and resolves it to the element once committed', () => {
    const sink = registry.begin();
    const node: ClrComponentContext = { type: 'textbox' };

    sink.note(node, input);
    expect(node.ref).toBe('e1');
    expect(registry.resolve('e1')).toBeNull();

    sink.commit();
    expect(registry.resolve('e1')).toEqual({ elements: [input], type: 'textbox', label: undefined });
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

  it('records the host that renders a node ahead of the element inside it, as the node ends up', () => {
    const sink = registry.begin();
    const node: ClrComponentContext = { type: 'combobox' };

    sink.note(node, input);
    sink.note({ ...node, label: 'Cluster' }, host);
    sink.commit();

    expect(registry.resolve(String(node.ref))).toEqual({ elements: [host, input], type: 'combobox', label: 'Cluster' });
  });

  it('only resolves refs from the latest committed snapshot', () => {
    const first = registry.begin();
    const node: ClrComponentContext = { type: 'textbox' };
    first.note(node, input);
    first.commit();

    const second = registry.begin();
    second.note({ type: 'checkbox' }, document.createElement('input'));
    second.commit();

    expect(registry.resolve(String(node.ref))).toBeNull();
  });

  it('forgets everything on clear', () => {
    const sink = registry.begin();
    const node: ClrComponentContext = { type: 'textbox' };
    sink.note(node, input);
    sink.commit();

    registry.clear();

    expect(registry.resolve(String(node.ref))).toBeNull();
  });
});

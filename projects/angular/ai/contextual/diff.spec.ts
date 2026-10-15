/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { clrDiffContext, clrIsEmptyContextChange } from './diff';
import { ClrComponentContext, ClrPageContext } from './interfaces/context.interface';

describe('clrDiffContext', () => {
  function page(components: ClrComponentContext[], overrides: Partial<ClrPageContext> = {}): ClrPageContext {
    return { title: 'Hosts', url: '/hosts', regions: [], components, collectedAt: 'now', ...overrides };
  }

  const addButton: ClrComponentContext = { type: 'button', label: 'Add' };
  const form: ClrComponentContext = {
    type: 'form',
    children: [{ type: 'textbox', label: 'Host name', state: { value: '' } }, addButton],
  };

  it('lists everything as added for the first snapshot', () => {
    const change = clrDiffContext(null, page([form]));
    expect(change.added).toEqual([form]);
    expect(change.removed).toEqual([]);
    expect(change.routeChanged).toBe(true);
  });

  it('reports nothing when nothing changed', () => {
    const change = clrDiffContext(page([form]), page([form]));
    expect(clrIsEmptyContextChange(change)).toBe(true);
  });

  it('reports a node whose own state changed, without its children', () => {
    const typed: ClrComponentContext = {
      ...form,
      children: [{ type: 'textbox', label: 'Host name', state: { value: 'esx-04' } }, addButton],
    };
    const change = clrDiffContext(page([form]), page([typed]));
    expect(change.changed).toEqual([
      {
        before: { type: 'textbox', label: 'Host name', state: { value: '' } },
        after: { type: 'textbox', label: 'Host name', state: { value: 'esx-04' } },
      },
    ]);
    expect(change.added).toEqual([]);
    expect(change.removed).toEqual([]);
  });

  it('reports an added subtree once, with its children, and a removed one without them', () => {
    const dialog: ClrComponentContext = { type: 'dialog', label: 'Add host', children: [form] };
    const opened = clrDiffContext(page([]), page([dialog]));
    expect(opened.added).toEqual([dialog]);

    const closed = clrDiffContext(page([dialog]), page([]));
    expect(closed.removed).toEqual([{ type: 'dialog', label: 'Add host' }]);
  });

  it('keeps look-alike siblings apart by order', () => {
    const before = page([
      { type: 'button', label: 'Delete', state: { disabled: true } },
      { type: 'button', label: 'Delete' },
    ]);
    const after = page([
      { type: 'button', label: 'Delete' },
      { type: 'button', label: 'Delete' },
    ]);
    const change = clrDiffContext(before, after);
    expect(change.changed.length).toBe(1);
    expect(change.changed[0].before.state).toEqual({ disabled: true });
  });

  it('notices the route, title and annotations moving', () => {
    const change = clrDiffContext(
      page([], { url: '/hosts', title: 'Hosts', regions: [{ type: 'region', label: 'A' }] }),
      page([], { url: '/vms', title: 'VMs', regions: [{ type: 'region', label: 'B' }] })
    );
    expect(change.routeChanged).toBe(true);
    expect(change.titleChanged).toBe(true);
    expect(change.regionsChanged).toBe(true);
  });
});

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComponentContext, ClrContextSnapshotOptions } from '@clr/angular/utils';

import { collectContextTree } from './walk';

describe('collectContextTree', () => {
  let container: HTMLElement;

  const budgets = (overrides: Partial<ClrContextSnapshotOptions> = {}): Required<ClrContextSnapshotOptions> => ({
    maxTextLength: 100,
    maxItemsPerCollection: 25,
    maxComponents: 100,
    includeDomComponents: true,
    includeActions: true,
    includeFormValues: false,
    ...overrides,
  });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  function collect(html: string, overrides: Partial<ClrContextSnapshotOptions> = {}): ClrComponentContext[] {
    container.innerHTML = html;
    return collectContextTree(container, budgets(overrides));
  }

  it('describes an element by its ARIA role', () => {
    const [node] = collect('<div role="dialog" aria-label="Add rule"></div>');
    expect(node.type).toBe('dialog');
    expect(node.label).toBe('Add rule');
  });

  it('includes a role-less element that carries an accessible name', () => {
    const [node] = collect('<div aria-label="Usage summary"></div>');
    expect(node.type).toBe('group');
    expect(node.label).toBe('Usage summary');
  });

  it('includes a custom element that has no role, naming it by its tag', () => {
    const [node] = collect('<my-widget></my-widget>');
    expect(node.type).toBe('my-widget');
  });

  it('skips a container that carries neither role nor name', () => {
    expect(collect('<div class="card"></div>')).toEqual([]);
  });

  it('skips an ignored region entirely', () => {
    expect(collect('<div data-clr-context-ignore><div role="grid"></div></div>')).toEqual([]);
  });

  it('skips content hidden from assistive technology', () => {
    expect(collect('<div role="grid" aria-hidden="true"></div>')).toEqual([]);
  });

  it('skips a presentational element but still describes what is inside it', () => {
    const [node] = collect('<div role="presentation"><span role="button">Go</span></div>');
    expect(node.type).toBe('button');
    expect(node.label).toBe('Go');
  });

  it('nests a described element inside its nearest described ancestor', () => {
    const [dialog] = collect('<div role="dialog" aria-label="Add"><button>Save</button></div>');
    expect(dialog.type).toBe('dialog');
    expect(dialog.children?.[0].type).toBe('button');
    expect(dialog.children?.[0].label).toBe('Save');
  });

  it('attributes a role-bearing element to the custom element that renders it', () => {
    const [node] = collect('<clr-datagrid><div class="wrap"><div role="grid"></div></div></clr-datagrid>');
    expect(node.type).toBe('grid');
    expect(node.element).toBe('clr-datagrid');
  });

  it('does not attribute across a custom element that is described in its own right', () => {
    const [rowgroup] = collect('<clr-dg-row role="rowgroup"><div role="row"></div></clr-dg-row>');
    expect(rowgroup.element).toBe('clr-dg-row');
    expect(rowgroup.children?.[0].type).toBe('row');
    expect(rowgroup.children?.[0].element).toBeUndefined();
  });

  it('stops at a leaf role rather than describing its internals', () => {
    const [button] = collect('<button>Add <span role="img" aria-label="plus"></span></button>');
    expect(button.type).toBe('button');
    expect(button.children).toBeUndefined();
  });

  it('honours the component budget', () => {
    const nodes = collect('<div role="grid"></div><div role="grid"></div><div role="grid"></div>', {
      maxComponents: 2,
    });
    expect(nodes.length).toBe(2);
  });

  it('lets a custom extractor describe an element the collector would not understand', () => {
    container.innerHTML = '<chat-log><div>a</div><div>b</div></chat-log>';
    const nodes = collectContextTree(container, budgets(), [
      {
        selector: 'chat-log',
        extract: element => ({ type: 'chat-log', state: { messages: element.children.length } }),
      },
    ]);
    expect(nodes[0]).toEqual({ type: 'chat-log', state: { messages: 2 } });
  });

  it('summarises a collection role instead of describing every item in it', () => {
    const [grid] = collect('<table role="grid"><tbody><tr><td>a</td></tr><tr><td>b</td></tr></tbody></table>');
    expect(grid.type).toBe('grid');
    expect(grid.state?.rowCount).toBe(2);
    expect(grid.children).toBeUndefined();
  });

  it('still walks a container role, whose structure is the point', () => {
    const [dialog] = collect('<div role="dialog" aria-label="Add"><div role="region" aria-label="Body"></div></div>');
    expect(dialog.children?.[0].type).toBe('region');
  });

  it('labels an anonymous custom element with the text it renders', () => {
    const [node] = collect('<clr-dg-footer>2 items</clr-dg-footer>');
    expect(node).toEqual({ type: 'clr-dg-footer', element: 'clr-dg-footer', label: '2 items' });
  });
});

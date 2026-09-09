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

  it('does not describe text that exists only to describe another element', () => {
    const nodes = collect(
      '<my-field><input role="textbox" aria-describedby="hint" /><my-hint id="hint">Lowercase only</my-hint></my-field>'
    );

    // The hint reaches the field as its description, so a node of its own would only
    // repeat it and leave an agent guessing which field it belonged to.
    expect(nodes.map(node => node.type)).toEqual(['textbox']);
    expect(nodes[0].state?.description).toBe('Lowercase only');
  });

  it('still describes an element that is referenced as a label, which is real content', () => {
    const nodes = collect('<h2 id="t">Add rule</h2><div role="dialog" aria-labelledby="t"></div>');

    expect(nodes.map(node => node.type)).toEqual(['heading', 'dialog']);
  });

  it('reports a control nested inside a heading, rather than swallowing it into the label', () => {
    // The literal case this guards: a heading whose text is a name plus a genuinely
    // separate, independently focusable button — ordinary, valid markup.
    const [heading] = collect('<h2>Combobox <button>Toggle Disabled</button></h2>');

    expect(heading.type).toBe('heading');
    expect(heading.label).toBe('Combobox Toggle Disabled');
    expect(heading.children?.length).toBe(1);
    expect(heading.children?.[0].type).toBe('button');
    expect(heading.children?.[0].label).toBe('Toggle Disabled');
  });

  it('reports a dismiss action nested inside an alert or a status', () => {
    const [alert] = collect('<div role="alert">Disk almost full <button>Dismiss</button></div>');
    const [status] = collect('<div role="status">Saved <button>Undo</button></div>');

    expect(alert.children?.[0].type).toBe('button');
    expect(alert.children?.[0].label).toBe('Dismiss');
    expect(status.children?.[0].type).toBe('button');
    expect(status.children?.[0].label).toBe('Undo');
  });

  it('does not grow children on a widget leaf, where nothing inside has independent semantics', () => {
    // A button's own icon and text are decoration for the button itself, not a
    // separate control — unlike a heading, a button legitimately terminates the walk.
    const [button] = collect('<button><span aria-hidden="true">icon</span> Save</button>');

    expect(button.type).toBe('button');
    expect(button.label).toBe('Save');
    expect(button.children).toBeUndefined();
  });

  it("keeps a component's parts together when it renders more than one of them", () => {
    // A custom element with no role of its own is normally transparent — its lone
    // reportable descendant stands in for it directly. But when it renders more than
    // one independently reportable piece, flattening them out would scatter one
    // component into unrelated-looking siblings. This is deliberately generic markup —
    // no Clarity tag names — because the rule has to hold for any component shaped
    // this way, not just the ones we happened to test.
    const nodes = collect('<my-widget><div role="grid"></div><my-widget-footer>3 items</my-widget-footer></my-widget>');

    expect(nodes.length).toBe(1);
    expect(nodes[0].type).toBe('my-widget');
    expect(nodes[0].element).toBe('my-widget');
    expect(nodes[0].children?.map(child => child.type)).toEqual(['grid', 'my-widget-footer']);
    expect(nodes[0].children?.[1].label).toBe('3 items');
  });

  it('stays transparent when a component renders exactly one reportable piece', () => {
    // Regression guard: this is the existing, already-tested single-branch case and
    // must not start wrapping unnecessarily.
    const [node] = collect('<my-widget><div role="grid"></div></my-widget>');

    expect(node.type).toBe('grid');
    expect(node.element).toBe('my-widget');
    expect(node.children).toBeUndefined();
  });
});

describe('collectContextTree, what a summary must not hide', () => {
  let container: HTMLElement;

  const budgets = (overrides: Partial<ClrContextSnapshotOptions> = {}): Required<ClrContextSnapshotOptions> => ({
    maxTextLength: 100,
    maxItemsPerCollection: 25,
    maxComponents: 100,
    includeDomComponents: true,
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

  function types(nodes: ClrComponentContext[] | undefined): string[] {
    return (nodes ?? []).map(node => node.type);
  }

  it('reports the commands a menu offers', () => {
    const [menu] = collect(
      `<div role="menu">
         <div role="menuitem">Rename</div>
         <div role="menuitem" aria-disabled="true">Delete</div>
       </div>`
    );
    expect(menu.type).toBe('menu');
    expect(menu.state?.options).toEqual(['Rename', 'Delete']);
    expect(menu.state?.disabledOptions).toEqual(['Delete']);
    expect(menu.children).toBeUndefined();
  });

  it('walks a collection whose summary said nothing, rather than dropping its contents', () => {
    // A breadcrumb trail: role="list" around custom elements that are not list items.
    const [list] = collect(
      `<div role="list">
         <my-crumb><a href="/paints">Paints</a></my-crumb>
         <my-crumb><a href="/paints/watercolor" aria-current="page">Watercolor</a></my-crumb>
       </div>`
    );
    expect(list.type).toBe('list');
    expect(types(list.children)).toEqual(['link', 'link']);
    expect(list.children?.[1].state?.current).toBe('page');
  });

  it('keeps the links inside a summarised list, which are the point of a navigation list', () => {
    const [list] = collect('<ul><li><a href="/home">Home</a></li><li><a href="/hosts">Hosts</a></li></ul>');
    expect(list.state?.itemCount).toBe(2);
    expect(list.state?.items).toEqual(['Home', 'Hosts']);
    expect(types(list.children)).toEqual(['link', 'link']);
    expect(list.children?.[0].state?.href).toBe('/home');
  });

  it('does not repeat a plain list item as a node of its own', () => {
    const [list] = collect('<ul><li>one</li><li>two</li></ul>');
    expect(list.state?.items).toEqual(['one', 'two']);
    expect(list.children).toBeUndefined();
  });

  it('keeps a list item that has state of its own to report', () => {
    container.innerHTML = '<ul><li>Provision</li><li>Configure</li></ul>';
    (container.querySelector('li') as HTMLElement & { clrElementContext?: unknown }).clrElementContext = () => ({
      state: { status: 'success' },
    });
    const [list] = collectContextTree(container, budgets());
    expect(list.children?.length).toBe(1);
    expect(list.children?.[0]).toEqual({ type: 'listitem', label: 'Provision', state: { status: 'success' } });
  });

  it('still describes an unlabeled password field, with its value withheld', () => {
    const [field] = collect('<input type="password" value="hunter2" />');
    expect(field.type).toBe('textbox');
    expect(field.state?.redacted).toBe(true);
    expect(JSON.stringify(field)).not.toContain('hunter2');
  });

  it('withholds a value an extractor reports for an element inside a sensitive region', () => {
    container.innerHTML = '<div data-clr-context-redact><my-field data-value="4111 1111"></my-field></div>';
    const [node] = collectContextTree(container, budgets(), [
      {
        selector: 'my-field',
        extract: element => ({ type: 'textbox', state: { value: element.getAttribute('data-value') } }),
      },
    ]);
    expect(node.state?.redacted).toBe(true);
    expect('value' in (node.state ?? {})).toBe(false);
  });

  it('counts a wrapper node against the budget, so the budget is a real bound', () => {
    const nodes = collect(
      `<my-widget><div role="grid"></div><my-widget-footer>1</my-widget-footer></my-widget>
       <my-widget><div role="grid"></div><my-widget-footer>2</my-widget-footer></my-widget>`,
      { maxComponents: 3 }
    );
    const count = (list: ClrComponentContext[]): number =>
      list.reduce((total, node) => total + 1 + count(node.children ?? []), 0);
    expect(count(nodes)).toBeLessThanOrEqual(3);
  });

  it('merges what a multi-part component publishes onto the component, not onto each part', () => {
    container.innerHTML = '<my-grid><div role="grid"></div><my-grid-footer>2 of 40</my-grid-footer></my-grid>';
    (container.querySelector('my-grid') as HTMLElement & { clrElementContext?: unknown }).clrElementContext = () => ({
      state: { rowCount: 40 },
    });
    const [widget] = collectContextTree(container, budgets());
    expect(widget.type).toBe('my-grid');
    expect(widget.state).toEqual({ rowCount: 40 });
    expect(widget.children?.[1].state).toBeUndefined();
  });

  it('gives what a single-part component publishes to the part that stands in for it', () => {
    container.innerHTML = '<my-picker><input role="combobox" aria-label="Cluster" /></my-picker>';
    (container.querySelector('my-picker') as HTMLElement & { clrElementContext?: unknown }).clrElementContext = () => ({
      state: { options: ['Alpha', 'Beta'] },
    });
    const [node] = collectContextTree(container, budgets());
    expect(node.type).toBe('combobox');
    expect(node.element).toBe('my-picker');
    expect(node.state?.options).toEqual(['Alpha', 'Beta']);
  });

  it('still walks a described-by target that holds controls, such as a dialog described by its body', () => {
    const [dialog] = collect(
      `<div role="dialog" aria-label="Add host" aria-describedby="body">
         <div id="body"><p>Fill in the host.</p><input aria-label="Host name" /></div>
       </div>`
    );
    expect(types(dialog.children)).toEqual(['textbox']);
  });

  it('does not let an ignored region hide the content it describes itself with', () => {
    const nodes = collect(
      `<h1 id="title">Hosts</h1>
       <div data-clr-context-ignore aria-describedby="title">assistant</div>`
    );
    expect(types(nodes)).toEqual(['heading']);
  });

  it('skips content hidden with visibility rather than display', () => {
    expect(collect('<div role="tooltip" style="visibility: hidden">hint</div>')).toEqual([]);
    expect(collect('<div role="tooltip" style="opacity: 0">hint</div>')).toEqual([]);
  });

  it('skips an inert subtree, which a user cannot reach', () => {
    expect(collect('<div inert><button>Behind the modal</button></div>')).toEqual([]);
  });
});

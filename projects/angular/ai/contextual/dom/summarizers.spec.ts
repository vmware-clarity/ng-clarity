/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrContextSnapshotOptions } from '@clr/angular/utils';

import { summarizeRole } from './summarizers';

describe('summarizeRole', () => {
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

  afterEach(() => container.remove());

  function summarize(html: string, role: string, overrides: Partial<ClrContextSnapshotOptions> = {}) {
    container.innerHTML = html;
    const element = container.firstElementChild as HTMLElement;
    return summarizeRole(element, role, budgets(overrides));
  }

  it('has no summary for a role that is described by walking it', () => {
    expect(summarize('<div role="dialog"></div>', 'dialog')).toBeNull();
  });

  it('summarises a grid by its columns and rows rather than every cell', () => {
    const state = summarize(
      `<table role="grid">
         <thead><tr><th aria-sort="ascending">Name</th><th>Status</th></tr></thead>
         <tbody>
           <tr aria-selected="true"><td>a</td><td>up</td></tr>
           <tr><td>b</td><td>down</td></tr>
         </tbody>
       </table>`,
      'grid'
    );
    expect(state?.columns).toEqual(['Name', 'Status']);
    // Two data rows. The header row is structure, not data — an agent asking "how many
    // rows" never means "including the one naming the columns".
    expect(state?.rowCount).toBe(2);
    expect(state?.selectedRows).toBe(1);
    expect(state?.sort).toEqual({ column: 'Name', direction: 'ascending' });
  });

  it('prefers the declared row count, which is the only truth for a paginated grid', () => {
    const state = summarize('<div role="grid" aria-rowcount="4210"><div role="row"></div></div>', 'grid');
    expect(state?.rowCount).toBe(4210);
  });

  it('summarises a tablist by its tabs and which one is active', () => {
    const state = summarize(
      `<div role="tablist">
         <button role="tab" aria-selected="true">Details</button>
         <button role="tab" aria-selected="false">Settings</button>
       </div>`,
      'tablist'
    );
    expect(state?.tabs).toEqual(['Details', 'Settings']);
    expect(state?.activeTab).toBe('Details');
  });

  it('summarises a list by its size and its first items', () => {
    const state = summarize('<ul><li>one</li><li>two</li><li>three</li></ul>', 'list', {
      maxItemsPerCollection: 2,
    });
    expect(state?.itemCount).toBe(3);
    expect(state?.items).toEqual(['one', 'two']);
  });

  it('summarises a listbox by its options and the selected one', () => {
    const state = summarize(
      `<div role="listbox">
         <div role="option" aria-selected="true">alpha</div>
         <div role="option">beta</div>
       </div>`,
      'listbox'
    );
    expect(state?.options).toEqual(['alpha', 'beta']);
    expect(state?.selected).toEqual(['alpha']);
  });

  it('summarises a radiogroup by the choices it offers', () => {
    const state = summarize(
      `<div role="radiogroup">
         <label for="a">Gold</label><input id="a" type="radio" name="t" value="gold" checked />
         <label for="b">Silver</label><input id="b" type="radio" name="t" value="silver" />
       </div>`,
      'radiogroup'
    );
    expect(state?.options).toEqual(['Gold', 'Silver']);
  });

  it('withholds which radio is chosen until form values are opted into', () => {
    const markup = `<div role="radiogroup">
         <label for="a">Gold</label><input id="a" type="radio" name="t" value="gold" checked />
       </div>`;
    expect(summarize(markup, 'radiogroup')?.value).toBeUndefined();
    expect(summarize(markup, 'radiogroup', { includeFormValues: true })?.value).toBe('Gold');
  });

  it('summarises a native dropdown by the choices it offers', () => {
    const state = summarize(
      '<select><option value="one">One</option><option value="two">Two</option></select>',
      'combobox'
    );

    expect(state?.options).toEqual(['One', 'Two']);
  });

  it("reports a dropdown's choices without opting into form values, because they are authored not typed", () => {
    const state = summarize('<select><option value="one">One</option></select>', 'combobox');

    expect(state?.options).toEqual(['One']);
    expect('value' in (state ?? {})).toBe(false);
  });

  it('summarises a combobox that owns a separate listbox', () => {
    container.innerHTML = `
      <div>
        <input role="combobox" aria-owns="opts" />
        <div id="opts" role="listbox"><div role="option">Alpha</div><div role="option">Beta</div></div>
      </div>
    `;
    const input = container.querySelector('[role="combobox"]') as HTMLElement;

    expect(summarizeRole(input, 'combobox', budgets())?.options).toEqual(['Alpha', 'Beta']);
  });

  it('summarises an input backed by a datalist', () => {
    container.innerHTML = `
      <div>
        <input role="combobox" list="tiers" />
        <datalist id="tiers"><option value="gold">Gold</option><option value="silver">Silver</option></datalist>
      </div>
    `;
    const input = container.querySelector('[role="combobox"]') as HTMLElement;

    expect(summarizeRole(input, 'combobox', budgets())?.options).toEqual(['Gold', 'Silver']);
  });
});

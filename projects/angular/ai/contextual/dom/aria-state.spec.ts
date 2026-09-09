/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrContextSnapshotOptions } from '@clr/angular/utils';

import { ariaState } from './aria-state';

describe('ariaState', () => {
  const budgets = (): Required<ClrContextSnapshotOptions> => ({
    maxTextLength: 100,
    maxItemsPerCollection: 25,
    maxComponents: 100,
    includeDomComponents: true,
  });

  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => container.remove());

  function stateOf(html: string): Record<string, unknown> {
    container.innerHTML = html;
    const element = container.firstElementChild as HTMLElement;
    return ariaState(element, budgets());
  }

  function stateOfSelected(html: string, selector: string): Record<string, unknown> {
    container.innerHTML = html;
    const element = container.querySelector(selector) as HTMLElement;
    return ariaState(element, budgets());
  }

  it('reports aria-expanded as a boolean in both states', () => {
    expect(stateOf('<button aria-expanded="true">x</button>').expanded).toBe(true);
    expect(stateOf('<button aria-expanded="false">x</button>').expanded).toBe(false);
  });

  it("reports a column's sort direction", () => {
    expect(stateOf('<div role="columnheader" aria-sort="descending"></div>').sort).toBe('descending');
  });

  it("omits an unsorted column's sort direction", () => {
    expect('sort' in stateOf('<div role="columnheader" aria-sort="none"></div>')).toBe(false);
  });

  it('reports disabled only when the element actually is', () => {
    expect(stateOf('<button aria-disabled="true">x</button>').disabled).toBe(true);
    expect('disabled' in stateOf('<button aria-disabled="false">x</button>')).toBe(false);
  });

  it('reflects a native disabled control', () => {
    expect(stateOf('<input disabled />').disabled).toBe(true);
  });

  it('reflects a native required control', () => {
    expect(stateOf('<input required />').required).toBe(true);
  });

  it('reports what kind of thing aria-current marks', () => {
    expect(stateOf('<a href="/x" aria-current="page">x</a>').current).toBe('page');
  });

  it('reports aria-level as a number', () => {
    expect(stateOf('<div role="heading" aria-level="3"></div>').level).toBe(3);
  });

  it('reports a details element as open', () => {
    expect(stateOf('<details open><summary>x</summary></details>').open).toBe(true);
  });

  it('reports the constraints a control places on its value', () => {
    const state = stateOf('<input type="number" min="1" max="8" step="2" />');
    expect(state.min).toBe(1);
    expect(state.max).toBe(8);
    expect(state.step).toBe(2);
  });

  it('reports format constraints so an agent cannot propose an invalid value', () => {
    const state = stateOf('<input pattern="^[a-z-]{3,24}$" maxlength="24" />');
    expect(state.pattern).toBe('^[a-z-]{3,24}$');
    expect(state.maxLength).toBe(24);
  });

  it("reports a control's current value", () => {
    expect(stateOf('<input value="esx-prod-04" />').value).toBe('esx-prod-04');
  });

  it("reports a progress bar's value without opting into form values, because it is displayed not typed", () => {
    expect(stateOf('<div role="progressbar" aria-valuenow="40" aria-valuemax="100"></div>').value).toBe(40);
  });

  it('reports nothing for an element carrying no state', () => {
    expect(stateOf('<div role="region"></div>')).toEqual({});
  });

  it('reports where a link goes', () => {
    expect(stateOf('<a href="/clusters/42">x</a>').href).toBe('/clusters/42');
  });

  it('reports no href for an element that has none', () => {
    expect('href' in stateOf('<button>x</button>')).toBe(false);
  });

  it('resolves the text describing a control, so helper guidance reaches the field', () => {
    const state = stateOfSelected(
      '<input id="h" aria-describedby="hint" /><span id="hint">Lowercase letters only</span>',
      '#h'
    );

    expect(state.description).toBe('Lowercase letters only');
  });

  it('joins every element that describes a control, so an error joins the helper text', () => {
    const state = stateOfSelected(
      '<input id="h" aria-describedby="hint err" /><span id="hint">Lowercase only</span><span id="err">Name is taken</span>',
      '#h'
    );

    expect(state.description).toBe('Lowercase only Name is taken');
  });

  it('reports no description when nothing describes the control', () => {
    expect('description' in stateOf('<input />')).toBe(false);
  });

  it('reports no description when aria-describedby points at nothing', () => {
    expect('description' in stateOfSelected('<input id="h" aria-describedby="missing" />', '#h')).toBe(false);
  });

  describe('sensitive values', () => {
    it('never reports a password, even when values are collected', () => {
      const state = stateOf('<input type="password" value="hunter2" />');

      expect(state.value).toBeUndefined();
      expect(JSON.stringify(state)).not.toContain('hunter2');
    });

    it('says a value is withheld rather than silently omitting it', () => {
      expect(stateOf('<input type="password" value="hunter2" />').redacted).toBe(true);
    });

    it('never reports a file selection', () => {
      const state = stateOf('<input type="file" />');

      expect(state.value).toBeUndefined();
      expect(state.redacted).toBe(true);
    });

    it('withholds a value the application marked as sensitive', () => {
      const state = stateOf('<input data-clr-context-redact value="tok_live_abc123" />');

      expect(state.value).toBeUndefined();
      expect(state.redacted).toBe(true);
    });

    it('withholds a value inside a region the application marked as sensitive', () => {
      container.innerHTML = '<div data-clr-context-redact><input id="t" value="tok_live_abc123" /></div>';
      const input = container.querySelector('#t') as HTMLElement;
      const state = ariaState(input, budgets());

      expect(state.value).toBeUndefined();
      expect(state.redacted).toBe(true);
    });

    it('withholds a value the markup says is a credential', () => {
      const state = stateOf('<input autocomplete="current-password" value="hunter2" />');

      expect(state.value).toBeUndefined();
      expect(state.redacted).toBe(true);
    });

    it('withholds a value the markup says is a payment card', () => {
      expect(stateOf('<input autocomplete="cc-number" value="4111111111111111" />').redacted).toBe(true);
    });

    it('still reports an ordinary value', () => {
      expect(stateOf('<input value="esx-prod-04" />').value).toBe('esx-prod-04');
    });
  });
});

describe('ariaState, native values as an agent should read them', () => {
  const budgets = (): Required<ClrContextSnapshotOptions> => ({
    maxTextLength: 100,
    maxItemsPerCollection: 25,
    maxComponents: 100,
    includeDomComponents: true,
  });

  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => container.remove());

  function stateOf(html: string): Record<string, unknown> {
    container.innerHTML = html;
    return ariaState(container.firstElementChild as HTMLElement, budgets());
  }

  it('reports a native checkbox as checked, the same way an ARIA one reads', () => {
    expect(stateOf('<input type="checkbox" checked />').checked).toBe(true);
    expect(stateOf('<input type="checkbox" />').checked).toBe(false);
    expect('value' in stateOf('<input type="checkbox" checked />')).toBe(false);
  });

  it('reports a native radio as checked too', () => {
    expect(stateOf('<input type="radio" checked />').checked).toBe(true);
  });

  it('reports no value for a button, whose value is a submission detail', () => {
    expect('value' in stateOf('<button type="submit" value="go">Go</button>')).toBe(false);
    expect('value' in stateOf('<input type="submit" value="Go" />')).toBe(false);
  });

  it("reports a select's chosen option by its text, not by an internal key", () => {
    const state = stateOf(
      '<select><option value="0: Object">Alpha</option><option value="1: Object" selected>Beta</option></select>'
    );
    expect(state.value).toBe('Beta');
  });

  it("reports a multiple select's choices as a list", () => {
    const state = stateOf(
      '<select multiple><option selected>a</option><option>b</option><option selected>c</option></select>'
    );
    expect(state.value).toEqual(['a', 'c']);
  });

  it('prefers the value as displayed over the number behind it', () => {
    expect(stateOf('<div role="slider" aria-valuenow="3" aria-valuetext="Large"></div>').value).toBe('Large');
  });

  it('trusts the caller about a sensitive region, without searching the ancestry again', () => {
    container.innerHTML = '<input value="4111" />';
    const state = ariaState(container.firstElementChild as HTMLElement, budgets(), true);
    expect(state.redacted).toBe(true);
    expect('value' in state).toBe(false);
  });
});

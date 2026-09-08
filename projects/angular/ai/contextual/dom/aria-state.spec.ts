/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrContextSnapshotOptions } from '@clr/angular/utils';

import { ariaState } from './aria-state';
import { resolveRole } from './roles';

describe('ariaState', () => {
  const budgets = (includeFormValues = false): Required<ClrContextSnapshotOptions> => ({
    maxTextLength: 100,
    maxItemsPerCollection: 25,
    maxComponents: 100,
    includeDomComponents: true,
    includeActions: true,
    includeFormValues,
  });

  function stateOf(html: string, includeFormValues = false): Record<string, unknown> {
    const container = document.createElement('div');
    container.innerHTML = html;
    const element = container.firstElementChild as HTMLElement;
    return ariaState(element, resolveRole(element), budgets(includeFormValues));
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

  it("withholds a control's value unless form values were opted into", () => {
    expect('value' in stateOf('<input value="esx-prod-04" />')).toBe(false);
  });

  it("reports a control's value once form values are opted into", () => {
    expect(stateOf('<input value="esx-prod-04" />', true).value).toBe('esx-prod-04');
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
});

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrElementContextCallback, elementContextOf, publishElementContext } from './element-context';

describe('publishElementContext', () => {
  let host: HTMLElement;

  beforeEach(() => {
    host = document.createElement('div');
  });

  it('makes the callback discoverable for the host element', () => {
    const callback: ClrElementContextCallback = () => ({ type: 'combobox' });

    publishElementContext(host, callback);

    expect(elementContextOf(host)).toBe(callback);
  });

  it('removes the callback when the returned teardown runs', () => {
    const teardown = publishElementContext(host, () => ({ type: 'combobox' }));
    expect(elementContextOf(host), 'expected the callback to be published first').toBeDefined();

    teardown();

    expect(elementContextOf(host)).toBeUndefined();
  });

  it('replaces a previously published callback', () => {
    const second: ClrElementContextCallback = () => ({ type: 'datagrid' });

    publishElementContext(host, () => ({ type: 'combobox' }));
    publishElementContext(host, second);

    expect(elementContextOf(host)).toBe(second);
  });

  it('leaves nothing on the element itself', () => {
    publishElementContext(host, () => ({ type: 'combobox' }));

    expect(Object.keys(host)).toEqual([]);
    expect(host.attributes.length).toBe(0);
  });

  it('leaves a newer callback in place when an older teardown runs', () => {
    const newer: ClrElementContextCallback = () => ({ type: 'datagrid' });

    const staleTeardown = publishElementContext(host, () => ({ type: 'combobox' }));
    publishElementContext(host, newer);
    staleTeardown();

    expect(elementContextOf(host)).toBe(newer);
  });
});

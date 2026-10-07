/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CLR_ELEMENT_CONTEXT_PROPERTY, ClrElementContextCallback, clrPublishElementContext } from './element-context';

describe('clrPublishElementContext', () => {
  let host: HTMLElement;

  beforeEach(() => {
    host = document.createElement('div');
  });

  function publishedOn(element: HTMLElement): ClrElementContextCallback | undefined {
    return (element as HTMLElement & { [CLR_ELEMENT_CONTEXT_PROPERTY]?: ClrElementContextCallback })[
      CLR_ELEMENT_CONTEXT_PROPERTY
    ];
  }

  it('makes the callback discoverable on the host element', () => {
    const callback: ClrElementContextCallback = () => ({ type: 'combobox' });

    clrPublishElementContext(host, callback);

    expect(publishedOn(host)).toBe(callback);
  });

  it('removes the callback when the returned teardown runs', () => {
    const teardown = clrPublishElementContext(host, () => ({ type: 'combobox' }));
    expect(CLR_ELEMENT_CONTEXT_PROPERTY in host).toBe(true, 'expected the callback to be published first');

    teardown();

    expect(CLR_ELEMENT_CONTEXT_PROPERTY in host).toBe(false);
  });

  it('replaces a previously published callback', () => {
    const second: ClrElementContextCallback = () => ({ type: 'datagrid' });

    clrPublishElementContext(host, () => ({ type: 'combobox' }));
    clrPublishElementContext(host, second);

    expect(publishedOn(host)).toBe(second);
  });

  it('leaves a newer callback in place when an older teardown runs', () => {
    const newer: ClrElementContextCallback = () => ({ type: 'datagrid' });

    const staleTeardown = clrPublishElementContext(host, () => ({ type: 'combobox' }));
    clrPublishElementContext(host, newer);
    staleTeardown();

    expect(publishedOn(host)).toBe(newer);
  });
});

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CLR_ELEMENT_MUTATOR_PROPERTY, ClrElementMutator, clrPublishElementMutator } from './element-mutator';

function readElementMutator(element: Element): ClrElementMutator | null {
  return ((element as Element & Record<string, unknown>)[CLR_ELEMENT_MUTATOR_PROPERTY] as ClrElementMutator) ?? null;
}

describe('clrPublishElementMutator', () => {
  let host: HTMLElement;

  beforeEach(() => {
    host = document.createElement('div');
  });

  it('makes the mutator discoverable on the host element', () => {
    const mutator = { coerce: (proposed: unknown) => ({ value: proposed }) };

    clrPublishElementMutator(host, mutator);

    expect(readElementMutator(host)).toBe(mutator);
  });

  it('removes the mutator when the returned teardown runs', () => {
    const teardown = clrPublishElementMutator(host, { read: () => null });

    teardown();

    expect(CLR_ELEMENT_MUTATOR_PROPERTY in host).toBe(false);
    expect(readElementMutator(host)).toBeNull();
  });

  it('does not let a stale teardown remove a newer mutator', () => {
    const staleTeardown = clrPublishElementMutator(host, { read: () => 'old' });
    const newer = { read: () => 'new' };
    clrPublishElementMutator(host, newer);

    staleTeardown();

    expect(readElementMutator(host)).toBe(newer);
  });
});

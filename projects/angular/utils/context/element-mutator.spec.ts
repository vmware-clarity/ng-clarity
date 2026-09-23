/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CLR_ELEMENT_MUTATOR_PROPERTY, publishElementMutator, readElementMutator } from './element-mutator';

describe('publishElementMutator', () => {
  let host: HTMLElement;

  beforeEach(() => {
    host = document.createElement('div');
  });

  it('makes the mutator discoverable on the host element', () => {
    const mutator = { coerce: (proposed: unknown) => ({ value: proposed }) };

    publishElementMutator(host, mutator);

    expect(readElementMutator(host)).toBe(mutator);
  });

  it('removes the mutator when the returned teardown runs', () => {
    const teardown = publishElementMutator(host, { read: () => null });

    teardown();

    expect(CLR_ELEMENT_MUTATOR_PROPERTY in host).toBe(false);
    expect(readElementMutator(host)).toBeNull();
  });

  it('does not let a stale teardown remove a newer mutator', () => {
    const staleTeardown = publishElementMutator(host, { read: () => 'old' });
    const newer = { read: () => 'new' };
    publishElementMutator(host, newer);

    staleTeardown();

    expect(readElementMutator(host)).toBe(newer);
  });

  it('reads nothing from an element that publishes nothing, or something that is not a mutator', () => {
    expect(readElementMutator(host)).toBeNull();
    (host as HTMLElement & Record<string, unknown>)[CLR_ELEMENT_MUTATOR_PROPERTY] = 'not a mutator';
    expect(readElementMutator(host)).toBeNull();
  });
});

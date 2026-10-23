/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CLR_ELEMENT_MUTATOR_PROPERTY, publishElementMutator } from '@clr/angular/utils';

import { readElementMutator } from './element-mutator';

describe('readElementMutator', () => {
  it('reads the mutator an element publishes', () => {
    const host = document.createElement('div');
    const mutator = { read: () => 'value' };
    publishElementMutator(host, mutator);

    expect(readElementMutator(host)).toBe(mutator);
  });

  it('reads nothing from an element that publishes nothing, or something that is not a mutator', () => {
    const host = document.createElement('div');
    expect(readElementMutator(host)).toBeNull();
    (host as unknown as Record<string, unknown>)[CLR_ELEMENT_MUTATOR_PROPERTY] = 'not a mutator';
    expect(readElementMutator(host)).toBeNull();
  });
});

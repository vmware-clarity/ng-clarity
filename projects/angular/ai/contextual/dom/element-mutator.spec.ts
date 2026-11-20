/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { publishElementMutator } from '@clr/angular/utils';

import { readElementMutator } from './element-mutator';

describe('readElementMutator', () => {
  it('reads the mutator an element publishes', () => {
    const host = document.createElement('div');
    const mutator = { read: () => 'value' };
    publishElementMutator(host, mutator);

    expect(readElementMutator(host)).toBe(mutator);
  });

  it('reads nothing from an element that publishes nothing, or one a page script planted on it', () => {
    const host = document.createElement('div');
    expect(readElementMutator(host)).toBeNull();
    (host as unknown as Record<string, unknown>)['clrElementMutator'] = { read: () => 'planted' };
    expect(readElementMutator(host)).toBeNull();
  });
});

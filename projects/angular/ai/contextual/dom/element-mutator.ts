/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CLR_ELEMENT_MUTATOR_PROPERTY, ClrElementMutator } from '@clr/angular/utils';

/** The mutator an element publishes with `publishElementMutator`, if any. */
export function readElementMutator(element: Element): ClrElementMutator | null {
  const mutator = (element as Element & { [CLR_ELEMENT_MUTATOR_PROPERTY]?: unknown })[CLR_ELEMENT_MUTATOR_PROPERTY];
  return mutator && typeof mutator === 'object' ? (mutator as ClrElementMutator) : null;
}

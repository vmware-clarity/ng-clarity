/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrContextSnapshotOptions } from './context.interface';
import { publishFor } from './publish';

/**
 * A coerced or written value, or an actionable refusal. `display` is the value in agent terms, shown to
 * the policy, and must hold nothing the published context withholds.
 */
export type ClrElementMutation =
  | { value: unknown; display?: unknown; refused?: undefined }
  | { refused: string; value?: undefined; display?: undefined };

/**
 * How a component says it is written to, when its model is not what an agent sees (a combobox's option value, a
 * date input's locale string, datagrid selection). Every member is optional. The value after a write is read
 * from the `state.value` the component publishes with `publishElementContext`.
 */
export interface ClrElementMutator {
  /** `true` when the component is written as one thing and its rendered controls are internals. */
  ownsContents?: boolean;
  /** Turns an agent's proposal into the value the form control takes, or refuses; `null` proposes clearing. */
  coerce?(proposed: unknown, options?: Required<ClrContextSnapshotOptions>): ClrElementMutation;
  /** Writes the proposal directly, for state no form control holds, such as datagrid selection. */
  write?(proposed: unknown, options?: Required<ClrContextSnapshotOptions>): ClrElementMutation;
}

const mutators = new WeakMap<Element, ClrElementMutator>();

/**
 * Internal to Clarity's components; an application's own control is written through its form binding.
 * Publishes a mutator for the host element. It is kept off the element, so other scripts on the page can neither
 * read nor replace it. The teardown only removes the mutator it published.
 */
export function publishElementMutator(host: Element, mutator: ClrElementMutator): () => void {
  return publishFor(mutators, host, mutator);
}

/** The mutator published for the element, if any. */
export function elementMutatorOf(host: Element): ClrElementMutator | undefined {
  return mutators.get(host);
}

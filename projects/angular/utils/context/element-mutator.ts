/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrContextSnapshotOptions } from './context.interface';
import { publishOnElement } from './publish';

/**
 * Host element property through which a component says how it is written to, when its model is not
 * what an agent sees (a combobox's option value, a date input's locale string, datagrid selection).
 */
export const CLR_ELEMENT_MUTATOR_PROPERTY = 'clrElementMutator';

/**
 * A coerced or written value, or an actionable refusal. `display` is the value in agent terms, shown to
 * the policy, and must hold nothing the published context withholds.
 */
export type ClrElementMutation =
  | { value: unknown; display?: unknown; refused?: undefined }
  | { refused: string; value?: undefined; display?: undefined };

/** What a component publishes through {@link CLR_ELEMENT_MUTATOR_PROPERTY}; every member is optional. */
export interface ClrElementMutator {
  /** `true` when the component is written as one thing and its rendered controls are internals. */
  ownsContents?: boolean;
  /** Turns an agent's proposal into the value the form control takes, or refuses; `null` proposes clearing. */
  coerce?(proposed: unknown, options?: Required<ClrContextSnapshotOptions>): ClrElementMutation;
  /** Writes the proposal directly, for state no form control holds, such as datagrid selection. */
  write?(proposed: unknown, options?: Required<ClrContextSnapshotOptions>): ClrElementMutation;
  /** The current value in agent terms, read back after a write. */
  read?(options?: Required<ClrContextSnapshotOptions>): unknown;
}

/** Publishes a mutator on the host element. The teardown only removes the mutator it published. */
export function publishElementMutator(host: Element, mutator: ClrElementMutator): () => void {
  return publishOnElement(host, CLR_ELEMENT_MUTATOR_PROPERTY, mutator);
}

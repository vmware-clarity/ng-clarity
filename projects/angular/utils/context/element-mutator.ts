/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Name of the element property through which a component says how it is written to,
 * the way {@link CLR_ELEMENT_CONTEXT_PROPERTY} says what it is.
 *
 * Most controls need nothing here: their form control takes the value an agent proposes
 * as it is. The property exists for the ones whose model is not what an agent sees — a
 * combobox stores an option's value while an agent knows its label, a date input stores
 * a locale string while an agent has a date — and for state that is not a form control
 * at all, such as which datagrid rows are selected.
 *
 * Like the context property, this is a plain property carrying plain functions: a
 * component assigns it on its own host element and removes it on destroy, and the
 * mutation engine consults it before writing. Publishing costs one import.
 */
export const CLR_ELEMENT_MUTATOR_PROPERTY = 'clrElementMutator';

/**
 * The outcome of turning a proposed value into one the element takes, or of writing it:
 * the value, or the reason the element cannot take what was proposed. A refusal is
 * expected to be actionable — it names the labels that would have been accepted, say —
 * because an agent repairs from a reason and can only retry blindly from an error.
 */
export type ClrElementMutation = { value: unknown; refused?: never } | { refused: string; value?: never };

/**
 * What a component publishes through {@link CLR_ELEMENT_MUTATOR_PROPERTY}. Every member
 * is optional; a component publishes only what its form control cannot do on its own.
 */
export interface ClrElementMutator {
  /**
   * Turns what an agent proposes — an option's label, a date in any form — into the
   * value the element's form control takes, or refuses. `null` proposes clearing the
   * control and is passed through so the component can say what "empty" is for it.
   * The engine then writes the result through the form control as usual.
   */
  coerce?(proposed: unknown): ClrElementMutation;
  /**
   * Writes the proposal directly, for state that no form control holds — a datagrid's
   * row selection. Returns what is now true, in the terms an agent sees. When present,
   * the engine writes through this rather than through a form control.
   */
  write?(proposed: unknown): ClrElementMutation;
  /**
   * The element's current value in the terms an agent sees — labels rather than option
   * values — for reading back after a write. Without it the engine reads the form
   * control's value.
   */
  read?(): unknown;
}

/**
 * Publishes a component's mutator on its host element and returns the teardown to call
 * on destroy. The teardown only removes the mutator it published, so a stale teardown
 * cannot unpublish a newer one.
 */
export function publishElementMutator(host: Element, mutator: ClrElementMutator): () => void {
  const carrier = host as Element & { [CLR_ELEMENT_MUTATOR_PROPERTY]?: ClrElementMutator };
  carrier[CLR_ELEMENT_MUTATOR_PROPERTY] = mutator;

  return () => {
    if (carrier[CLR_ELEMENT_MUTATOR_PROPERTY] === mutator) {
      delete carrier[CLR_ELEMENT_MUTATOR_PROPERTY];
    }
  };
}

/** The mutator an element publishes, if any. */
export function readElementMutator(element: Element): ClrElementMutator | null {
  const mutator = (element as Element & { [CLR_ELEMENT_MUTATOR_PROPERTY]?: unknown })[CLR_ELEMENT_MUTATOR_PROPERTY];
  return mutator && typeof mutator === 'object' ? (mutator as ClrElementMutator) : null;
}

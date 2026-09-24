/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';

import { ClrContextChange } from '../diff';
import { ClrPageContext } from '../interfaces/context.interface';

/**
 * Gives a control a value. The control is named by the `ref` the snapshot gave it, never
 * by a selector: a ref can only be recalled from a snapshot, where a selector could be
 * made up. The value is whatever an agent would naturally say — the option's label for
 * a select or combobox, a date or ISO string for a date input, a boolean for a checkbox,
 * the labels of the rows to select for a datagrid — and the engine, or the component,
 * turns it into what the control takes.
 */
export interface ClrSetValueOperation {
  operation: 'setValue';
  /** The `ref` of the node to write to, from the latest snapshot. */
  ref: string;
  /**
   * What the node is, in the agent's words — its label. Checked against the node's
   * actual name before anything is written, so a ref that drifted onto a different
   * element is caught rather than silently written to.
   */
  description: string;
  value: unknown;
}

/**
 * Empties a control. Distinct from setting a value so an agent can say "no value"
 * deliberately, rather than either inventing one or leaving a stale one in place.
 */
export interface ClrClearOperation {
  operation: 'clear';
  ref: string;
  description: string;
}

/**
 * Navigates to a route from the snapshot's `availableRoutes`, through the router, so
 * every guard the application configured runs.
 */
export interface ClrNavigateOperation {
  operation: 'navigate';
  /** The route's path pattern exactly as `availableRoutes` listed it, e.g. `clusters/:id`. */
  path: string;
  /**
   * Values for the pattern's parameters, e.g. `{ id: '42' }`. Each value fills exactly
   * one path segment, whatever characters it contains; `.` and `..` are refused, since
   * they would move the navigation to a different route from the one classified.
   */
  params?: Record<string, string>;
  /**
   * Query parameters to add. Not constrained by the route: an application that acts on
   * query parameters (`returnUrl`, `action`) should classify on `ClrMutationTarget.queryParams`.
   */
  queryParams?: Record<string, string>;
}

/** One operation the mutation engine can apply. It never submits, clicks or invokes anything. */
export type ClrMutationOperation = ClrSetValueOperation | ClrClearOperation | ClrNavigateOperation;

/**
 * What the application says an operation would do, and therefore whether the engine may
 * apply it:
 *
 * - `reversible` — applied. Every applied write reports the previous value, so the
 *   application can undo it.
 * - `consequential` — applied only once the application's `confirm` hook agrees, which
 *   is where a person gets to see what is about to happen.
 * - `forbidden` — never applied.
 *
 * The engine never infers this. A field or a route is not consequential in itself;
 * "Delete account" is, and only the application knows which one that is.
 */
export type ClrMutationConsequence = 'reversible' | 'consequential' | 'forbidden';

/** What an operation is about to do, as given to the policy. */
export interface ClrMutationTarget {
  operation: ClrMutationOperation['operation'];
  /** The node's `ref`, for element operations. */
  ref?: string;
  /** The node's accessible name, for element operations. */
  label?: string;
  /** The node's role — `textbox`, `combobox`, `grid` — for element operations. */
  type?: string;
  /** The element the operation would write to, for element operations. */
  element?: Element;
  /** The route pattern, for navigation. */
  path?: string;
  /** The URL the navigation would go to, query string included. */
  url?: string;
  /** The query parameters the navigation would add, for navigation. */
  queryParams?: Record<string, string>;
  /**
   * The value about to be written, in the terms an agent and a person use: the option's
   * label, the radio's label, the date as the field shows it, `true` for a checkbox.
   * `null` or `[]` when the operation clears the control. This is what a policy should
   * judge and what a confirmation should show.
   */
  value?: unknown;
  /**
   * The value the form control will receive, which may be an option's bound object or a
   * locale string rather than anything a person would recognise. For inspection only.
   */
  modelValue?: unknown;
}

/**
 * The application's say over what the engine may change. Providing one is what enables
 * mutations at all: without it snapshots carry no refs and every operation is refused
 * as `unclassified`.
 */
export interface ClrMutationPolicy {
  /** Declares what each operation would do. See {@link ClrMutationConsequence}. */
  classify(target: ClrMutationTarget): ClrMutationConsequence;
  /**
   * Asked before a `consequential` operation is applied; resolving `false` refuses it.
   * A consequential operation with no hook to ask is refused as `unconfirmed`.
   */
  confirm?(target: ClrMutationTarget): boolean | Promise<boolean>;
  /**
   * Told what an `apply()` did once it is done, so the application can let the person
   * know — through a live region, a toast, a summary in the chat — that fields were
   * filled for them and which of them now show an error. The engine announces nothing
   * itself: the words, and the language, are the application's.
   */
  announce?(report: ClrMutationReport): void;
}

/**
 * The application's {@link ClrMutationPolicy}. Provide it with `provideClrMutationPolicy`
 * at application level: the engine is root-provided and reads the policy from the root
 * injector only.
 */
export const CLR_MUTATION_POLICY = new InjectionToken<ClrMutationPolicy>('CLR_MUTATION_POLICY');

/**
 * Enables the mutation engine with the application's policy. Application-level only
 * (`bootstrapApplication` or the root `providers`), which the return type enforces.
 *
 * ```ts
 * provideClrMutationPolicy({
 *   classify: target => (target.operation === 'navigate' ? 'consequential' : 'reversible'),
 *   confirm: target => confirmDialog.ask(`Go to ${target.url}?`),
 * });
 * ```
 */
export function provideClrMutationPolicy(policy: ClrMutationPolicy): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: CLR_MUTATION_POLICY, useValue: policy }]);
}

/**
 * Why an operation was not applied. Each comes with a `detail` an agent can act on:
 *
 * - `unclassified` — the application has not provided a {@link ClrMutationPolicy}.
 * - `forbidden` — the policy forbids it.
 * - `unconfirmed` — the policy calls it consequential and has no `confirm` hook.
 * - `declined` — the policy's `confirm` hook said no.
 * - `stale` — the ref's element is no longer on the page, or the page changed while the
 *   operation waited for confirmation; take a new snapshot.
 * - `mismatch` — the description does not match the node's name; take a new snapshot.
 * - `hidden` — the node is not currently shown to the user, or sits behind an open modal dialog.
 * - `redacted` — the node is in a region the application keeps from agents.
 * - `disabled`, `readOnly` — the control does not accept input.
 * - `unbound` — the control has no Angular form binding, which this engine requires, or
 *   belongs to another Angular application on the page.
 * - `unsupported` — the operation is malformed, or the node cannot take a value — a
 *   custom control that does not say how it is written to, a select that applies its
 *   value only on submit.
 * - `invalid` — the value is not one the control can take; the detail says what would be.
 * - `noRoute` — the path is not one of the application's `availableRoutes`.
 */
export type ClrMutationRefusal =
  | 'unclassified'
  | 'forbidden'
  | 'unconfirmed'
  | 'declined'
  | 'stale'
  | 'mismatch'
  | 'hidden'
  | 'redacted'
  | 'disabled'
  | 'readOnly'
  | 'unbound'
  | 'unsupported'
  | 'invalid'
  | 'noRoute';

/**
 * What is true after an element operation. Never a bare "ok": the value the control
 * actually holds, which may differ from what was asked for, and its validity, so that
 * an agent filling a form learns of a validation failure from the write itself.
 */
export interface ClrElementMutationResult {
  /** The operation this result is for. */
  operation: 'setValue' | 'clear';
  /** The ref the operation named. */
  ref: string;
  /** Whether the control now holds the value. */
  applied: boolean;
  /** The control's value now, in the terms an agent sees. */
  value?: unknown;
  /** The control's value before, so the application can restore it. */
  previous?: unknown;
  /** The form control's status after the write: `VALID`, `INVALID`, `PENDING` or `DISABLED`. */
  status?: string;
  /** The form control's validation errors after the write, when it has any. */
  errors?: Record<string, unknown>;
  refused?: ClrMutationRefusal;
  /** What an agent should do about a refusal, or what the control would have accepted. */
  detail?: string;
}

/**
 * What a navigation led to. The router's promise is not consulted: it resolves `true`
 * when a guard redirected elsewhere and `false` when the navigation was merely skipped,
 * and neither is what happened. The router's event stream is.
 *
 * - `navigated` — the page is now at the requested URL.
 * - `redirected` — a guard or redirect sent the page somewhere else; `url` says where.
 * - `unchanged` — the page was already there.
 * - `rejected` — a guard refused the navigation.
 * - `superseded` — another navigation started before this one finished.
 * - `failed` — the navigation errored; `detail` carries the message.
 */
export type ClrNavigationOutcome = 'navigated' | 'redirected' | 'unchanged' | 'rejected' | 'superseded' | 'failed';

/** What a navigate operation led to. */
export interface ClrNavigationMutationResult {
  /** The operation this result is for. */
  operation: 'navigate';
  /** The route pattern the operation named. */
  path: string;
  /** Whether the page moved, or was already where it was asked to go. */
  applied: boolean;
  outcome?: ClrNavigationOutcome;
  /** The router URL now. */
  url?: string;
  refused?: ClrMutationRefusal;
  detail?: string;
}

/** What one operation did: {@link ClrElementMutationResult} or {@link ClrNavigationMutationResult}. */
export type ClrMutationResult = ClrElementMutationResult | ClrNavigationMutationResult;

/**
 * What a batch of operations changed on the page, as {@link diffClrContext} reports it,
 * without the two full snapshots: the report already carries the one after.
 */
export type ClrMutationChanges = Omit<ClrContextChange, 'previous' | 'current'>;

/**
 * What applying a plan did, and what the page looks like now: the per-operation
 * results, a fresh snapshot with refs an agent can continue from, and the difference
 * from the snapshot before, so a multi-step agent can see that step three changed
 * nothing before it proceeds to step four.
 */
export interface ClrMutationReport {
  results: ClrMutationResult[];
  /** The page after the operations, taken with the options given to `apply()`. */
  snapshot: ClrPageContext;
  /** What the operations changed: the difference between the page before and after, taken alike. */
  changes: ClrMutationChanges;
}

/**
 * What applying an operation would do, without doing it: the resolved target, its
 * classification, and the value that would be written, or the refusal it would meet.
 */
export interface ClrMutationPlanEntry {
  operation: ClrMutationOperation;
  consequence?: ClrMutationConsequence;
  target?: ClrMutationTarget;
  refused?: ClrMutationRefusal;
  detail?: string;
}

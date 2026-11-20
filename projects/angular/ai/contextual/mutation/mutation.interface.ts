/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';

import { ClrContextChange } from '../diff';
import { ClrPageContext } from '../interfaces/context.interface';

/** Gives a control a value, named by its snapshot `ref` (never a selector), in the agent's terms. */
export interface ClrSetValueOperation {
  /** Gives a control a value. */
  operation: 'setValue';
  /** The `ref` of the node to write to, from the latest snapshot. */
  ref: string;
  /** The node's label in the agent's words, checked against its name so a drifted ref is caught. */
  description: string;
  /** The value, in the agent's terms: text, a number, `true`, an option's label, a date. */
  value: unknown;
}

/** Empties a control, so an agent can say "no value" deliberately. */
export interface ClrClearOperation {
  /** Empties a control. */
  operation: 'clear';
  /** The `ref` of the node to clear, from the latest snapshot. */
  ref: string;
  /** What the node is, in the agent's words; checked as for `setValue`. */
  description: string;
}

/** Navigates through the router, so guards run, to a pattern `availableRoutes` would list. */
export interface ClrNavigateOperation {
  /** Goes to a route. */
  operation: 'navigate';
  /** The route's path pattern exactly as `availableRoutes` listed it, e.g. `clusters/:id`. */
  path: string;
  /** Values for the pattern's parameters, e.g. `{ id: '42' }`; each fills one segment, and `.`/`..` are refused. */
  params?: Record<string, string>;
  /** Query parameters to add, unconstrained by the route; classify on `ClrMutationTarget.queryParams`. */
  queryParams?: Record<string, string>;
}

/** One operation the mutation engine can apply. It never submits, clicks or invokes anything. */
export type ClrMutationOperation = ClrSetValueOperation | ClrClearOperation | ClrNavigateOperation;

/**
 * What an operation would do: `reversible` is applied, `consequential` needs `confirm`, `forbidden` never.
 * Only the application knows which is which; the engine never infers it.
 */
export type ClrMutationConsequence = 'reversible' | 'consequential' | 'forbidden';

/** What an operation is about to do, as given to the policy. */
export interface ClrMutationTarget {
  /** The operation being judged. */
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
  /** The query parameters the navigation would add; the agent chose them freely. */
  queryParams?: Record<string, string>;
  /** The value about to be written, in the agent's terms; `null` or `[]` for a clear. Judge and show this one. */
  value?: unknown;
  /** The value the form control will receive, for inspection only; absent where the component translates it. */
  modelValue?: unknown;
}

/** What the engine may change. Without a policy, every operation is refused as `unclassified`. */
export interface ClrMutationPolicy {
  /** Milliseconds `confirm` may take before the operation is `declined`. Default 2 minutes; `0` waits forever. */
  confirmTimeoutMs?: number;
  /** Declares what each operation would do. For a navigation, judge the whole `url`: query parameters act on load. */
  classify(target: ClrMutationTarget): ClrMutationConsequence;
  /** Asked before a `consequential` operation; resolving `false` refuses it. */
  confirm?(target: ClrMutationTarget): boolean | Promise<boolean>;
  /** Told what an `apply()` did, so the application can announce it; the engine announces nothing itself. */
  announce?(report: ClrMutationReport): void;
}

/** The application's {@link ClrMutationPolicy}; provide it at application level with `provideClrMutationPolicy`. */
export const CLR_MUTATION_POLICY = new InjectionToken<ClrMutationPolicy>('CLR_MUTATION_POLICY');

/**
 * Enables the mutation engine with the application's policy. Provide it at application level, not in a lazy route.
 * ```ts
 * provideClrMutationPolicy({ classify: t => (t.operation === 'navigate' ? 'consequential' : 'reversible') });
 * ```
 */
export function provideClrMutationPolicy(policy: ClrMutationPolicy): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: CLR_MUTATION_POLICY, useValue: policy }]);
}

/** Why an operation was not applied; each comes with a `detail` an agent can act on. */
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

/** What is true after an element operation: the value the control holds and its validity. */
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
  /** Why the operation was not applied, when it was not. */
  refused?: ClrMutationRefusal;
  /** What an agent should do about a refusal, or what the control would have accepted. */
  detail?: string;
}

/** What a navigation led to, read from the router's events rather than its promise. */
export type ClrNavigationOutcome = 'navigated' | 'redirected' | 'unchanged' | 'rejected' | 'superseded' | 'failed';

/** What a navigate operation led to. */
export interface ClrNavigationMutationResult {
  /** The operation this result is for. */
  operation: 'navigate';
  /** The route pattern the operation named. */
  path: string;
  /** Whether the page moved, or was already where it was asked to go. */
  applied: boolean;
  /** What the navigation led to, when it ran. */
  outcome?: ClrNavigationOutcome;
  /** The router URL now. */
  url?: string;
  /** Why the operation was not run, when it was not. */
  refused?: ClrMutationRefusal;
  /** What went wrong, or what to do about a refusal. */
  detail?: string;
}

/** What one operation did: {@link ClrElementMutationResult} or {@link ClrNavigationMutationResult}. */
export type ClrMutationResult = ClrElementMutationResult | ClrNavigationMutationResult;

/** What a batch changed, as {@link clrDiffContext} reports it, without the two snapshots. */
export type ClrMutationChanges = Omit<ClrContextChange, 'previous' | 'current'>;

/** What applying a plan did: per-operation results, a fresh snapshot and the difference from before. */
export interface ClrMutationReport {
  /** What each operation did, in the order given. */
  results: ClrMutationResult[];
  /** The page after the operations, taken with the options given to `apply()`. */
  snapshot: ClrPageContext;
  /** What the operations changed: the difference between the page before and after, taken alike. */
  changes: ClrMutationChanges;
}

/** What applying an operation would do, without doing it. */
export interface ClrMutationPlanEntry {
  /** The operation this entry is for. */
  operation: ClrMutationOperation;
  /** How the policy classified it, when it could be resolved. */
  consequence?: ClrMutationConsequence;
  /** What it would write to, and with what, when it could be resolved. */
  target?: ClrMutationTarget;
  /** The refusal it would meet, if any. */
  refused?: ClrMutationRefusal;
  /** What to do about that refusal. */
  detail?: string;
}

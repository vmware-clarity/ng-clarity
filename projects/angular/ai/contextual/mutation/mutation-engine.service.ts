/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ApplicationRef, inject, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { ContextRefRegistryService } from './context-ref-registry.service';
import {
  CLR_MUTATION_POLICY,
  ClrClearOperation,
  ClrElementMutationResult,
  ClrMutationChanges,
  ClrMutationConsequence,
  ClrMutationOperation,
  ClrMutationPlanEntry,
  ClrMutationRefusal,
  ClrMutationReport,
  ClrMutationResult,
  ClrMutationTarget,
  ClrNavigateOperation,
  ClrNavigationMutationResult,
  ClrSetValueOperation,
} from './mutation.interface';
import { fillRoutePath, navigateAndReport, urlTreeFor } from './navigate';
import {
  coerceValue,
  descriptionMatches,
  markViewForCheck,
  modelValueOf,
  resolveWriteTarget,
  WriteOutcome,
  WriteTarget,
  writeValue,
} from './write';
import { attempt } from '../attempt';
import { ClrContextChange, clrDiffContext } from '../diff';
import { isOutsideSnapshot, openModalDialogs } from '../dom/walk';
import { ClrContextSnapshotOptions } from '../interfaces/context.interface';
import { CLR_CONTEXT_OPTIONS } from '../providers/context-options';
import { ClrContextEngineService } from '../providers/contextual-engine.service';
import { availableRoutes } from '../routes';
import { resolveSnapshotOptions, withCallOptions } from '../snapshot-options';

const CONFIRM_TIMEOUT_MS = 120_000;

/**
 * Fills form controls and navigates for an AI agent, from the refs and routes in snapshots; never submits or clicks.
 * For application code only: results carry unwithheld page values, so no untrusted surface exposes it.
 */
@Injectable({ providedIn: 'root' })
export class ClrMutationEngineService {
  private readonly contextEngine = inject(ClrContextEngineService);
  private readonly refs = inject(ContextRefRegistryService);
  private readonly policy = inject(CLR_MUTATION_POLICY, { optional: true });
  private readonly router = inject(Router, { optional: true });
  private readonly zone = inject(NgZone);
  private readonly application = inject(ApplicationRef);
  private readonly contextOptions = inject(CLR_CONTEXT_OPTIONS, { optional: true });
  // Batches run one at a time so agent turns do not interleave.
  private queue: Promise<unknown> = Promise.resolve();

  /** What applying the operations would do, without doing it. Pass the same `snapshotOptions` as `apply()`. */
  plan(operations: ClrMutationOperation[], snapshotOptions?: ClrContextSnapshotOptions): ClrMutationPlanEntry[] {
    const options = this.scopeOptions(snapshotOptions);
    return listOf(operations).map(operation => {
      const prepared = this.prepareSafely(operation, options);
      if ('refused' in prepared) {
        return { operation, refused: prepared.refused, detail: prepared.detail };
      }
      const entry: ClrMutationPlanEntry = { operation, target: prepared.target, consequence: prepared.consequence };
      const blocked = this.verdict(prepared.consequence);
      if (blocked) {
        entry.refused = blocked.refused;
        entry.detail = blocked.detail;
      }
      return entry;
    });
  }

  /** Applies the operations in order and reports each result, a fresh snapshot and the changes. */
  apply(operations: ClrMutationOperation[], snapshotOptions?: ClrContextSnapshotOptions): Promise<ClrMutationReport> {
    const run = this.queue.then(() => this.run(operations, snapshotOptions));
    this.queue = run.catch(() => undefined);
    return run;
  }

  private async run(
    operations: ClrMutationOperation[],
    snapshotOptions?: ClrContextSnapshotOptions
  ): Promise<ClrMutationReport> {
    const before = this.contextEngine.getSnapshot(snapshotOptions);
    const options = this.scopeOptions(snapshotOptions);
    const results: ClrMutationResult[] = [];
    for (const operation of listOf(operations)) {
      try {
        results.push(await this.applyOne(operation, options));
      } catch (error) {
        results.push(refusal(operation, 'unsupported', unforeseen(error)));
      }
    }
    await this.catchUp();
    const snapshot = this.contextEngine.getSnapshot(snapshotOptions);
    const report: ClrMutationReport = {
      results,
      snapshot,
      changes: withoutSnapshots(clrDiffContext(before, snapshot)),
    };
    // The application's announcement failing must not lose the report.
    attempt(() => this.policy?.announce?.(report), undefined);
    return report;
  }

  /** Asks `confirm` for at most `confirmTimeoutMs`; the timer runs outside the zone so the app can stabilise. */
  private async confirm(target: ClrMutationTarget): Promise<boolean | 'timeout'> {
    const limit = this.policy?.confirmTimeoutMs;
    const timeoutMs = typeof limit === 'number' && Number.isFinite(limit) && limit >= 0 ? limit : CONFIRM_TIMEOUT_MS;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const answer = Promise.resolve()
      .then(() => this.policy?.confirm?.(target))
      .then(
        confirmed => confirmed === true,
        () => false
      );
    const expiry =
      timeoutMs > 0
        ? new Promise<'timeout'>(resolve => {
            this.zone.runOutsideAngular(() => (timer = setTimeout(() => resolve('timeout'), timeoutMs)));
          })
        : null;
    try {
      return await (expiry ? Promise.race([answer, expiry]) : answer);
    } finally {
      clearTimeout(timer);
    }
  }

  private async applyOne(
    operation: ClrMutationOperation,
    options: Required<ClrContextSnapshotOptions>
  ): Promise<ClrMutationResult> {
    let prepared = this.prepare(operation, options);
    if ('refused' in prepared) {
      return refusal(operation, prepared.refused, prepared.detail);
    }
    const blocked = this.verdict(prepared.consequence);
    if (blocked) {
      return refusal(operation, blocked.refused, blocked.detail);
    }
    if (prepared.consequence === 'consequential') {
      prepared = await this.confirmAndRecheck(operation, prepared, options);
      if ('refused' in prepared) {
        return refusal(operation, prepared.refused, prepared.detail);
      }
    }
    if (prepared.kind === 'navigate') {
      return this.navigate(prepared);
    }
    const { write, coerced } = prepared;
    let outcome: WriteOutcome;
    try {
      outcome = this.zone.run(() => writeValue(write, coerced));
    } catch (error) {
      outcome = {
        applied: false,
        refused: 'invalid',
        detail: error instanceof Error ? error.message : 'The control failed to take the value.',
      };
    }
    markViewForCheck(write.element);
    return { operation: prepared.operation.operation, ref: prepared.operation.ref, ...outcome };
  }

  /** Re-prepares after confirmation: the operation is written only if it is still exactly what was agreed to. */
  private async confirmAndRecheck(
    operation: ClrMutationOperation,
    prepared: Prepared,
    options: Required<ClrContextSnapshotOptions>
  ): Promise<Prepared | Refused> {
    // Modals open now are obstacles; one the application opens to ask the person is not.
    const knownModals = new Set(
      prepared.kind === 'write' ? openModalDialogs(prepared.write.control.ownerDocument) : []
    );
    const confirmed = await this.confirm(prepared.target);
    if (confirmed !== true) {
      return {
        refused: 'declined',
        detail:
          confirmed === 'timeout'
            ? 'The confirmation was not answered in time.'
            : 'The application declined the operation.',
      };
    }
    await this.catchUp();
    const again = this.prepare(operation, options, knownModals);
    if ('refused' in again || sameOperation(prepared, again)) {
      return again;
    }
    return {
      refused: 'stale',
      detail: 'The page changed while the operation waited for confirmation. Take a new snapshot and ask again.',
    };
  }

  /** Checks every view (zoneless apps, writes outside the zone) and lets scheduled work run. */
  private async catchUp(): Promise<void> {
    this.zone.run(() => this.application.tick());
    await settle(this.zone);
  }

  private prepareSafely(
    operation: ClrMutationOperation,
    options: Required<ClrContextSnapshotOptions>
  ): Prepared | Refused {
    try {
      return this.prepare(operation, options);
    } catch (error) {
      return { refused: 'unsupported', detail: unforeseen(error) };
    }
  }

  private scopeOptions(snapshotOptions?: ClrContextSnapshotOptions): Required<ClrContextSnapshotOptions> {
    return resolveSnapshotOptions(withCallOptions(this.contextOptions, snapshotOptions));
  }

  private prepare(
    operation: ClrMutationOperation,
    options: Required<ClrContextSnapshotOptions>,
    knownModals?: ReadonlySet<Element>
  ): Prepared | Refused {
    if (!this.policy) {
      return { refused: 'unclassified', detail: 'The application has not provided a mutation policy.' };
    }
    if (!operation || typeof operation !== 'object') {
      return { refused: 'unsupported', detail: 'An operation is expected.' };
    }
    if (operation.operation === 'navigate') {
      return this.prepareNavigation(operation);
    }
    if (operation.operation !== 'setValue' && operation.operation !== 'clear') {
      return { refused: 'unsupported', detail: 'Supported operations are setValue, clear and navigate.' };
    }
    // A missing value is malformed, not a request to clear: `clear` says that.
    if (operation.operation === 'setValue' && operation.value === undefined) {
      return { refused: 'unsupported', detail: 'setValue needs a value; use clear to empty the control.' };
    }
    if (typeof operation.ref !== 'string' || !operation.ref) {
      return {
        refused: 'unsupported',
        detail: 'The operation names no ref; only a node with a ref can be written to.',
      };
    }
    const ref = this.refs.resolve(operation.ref);
    if (!ref) {
      return {
        refused: 'stale',
        detail: 'The ref does not name anything on the page. Take a new snapshot and use its refs.',
      };
    }
    const resolution = resolveWriteTarget(ref, this.application, options, knownModals);
    if ('refused' in resolution) {
      return resolution;
    }
    const write: WriteTarget = resolution.target;
    // A ref outlives its snapshot, which may have used wider options; what these options leave out is not written.
    if (
      isOutsideSnapshot(write.element, options) ||
      (write.control !== write.element && isOutsideSnapshot(write.control, options)) ||
      options.excludeRoles.includes(write.type)
    ) {
      return { refused: 'hidden', detail: 'The control is outside what snapshots with these options describe.' };
    }
    if (!descriptionMatches(operation.description, write.label, write.type)) {
      return {
        refused: 'mismatch',
        detail: write.label
          ? `The node is "${write.label}", not "${String(operation.description)}". Take a new snapshot and use its refs.`
          : 'The node has no name; describe it by what it is, or give an empty string as the description.',
      };
    }
    const coerced = coerceValue(write, operation.operation === 'clear' ? null : operation.value);
    if (coerced.refused !== undefined) {
      return { refused: 'invalid', detail: coerced.refused };
    }
    const target: ClrMutationTarget = {
      operation: operation.operation,
      ref: operation.ref,
      label: write.label,
      type: write.type,
      element: write.element,
      value: coerced.display,
    };
    const modelValue = modelValueOf(write, coerced.value);
    if (modelValue !== undefined) {
      target.modelValue = modelValue;
    }
    return {
      kind: 'write',
      operation,
      target,
      consequence: this.classify(target),
      write,
      coerced: { value: coerced.value, display: coerced.display, bound: coerced.bound },
    };
  }

  private prepareNavigation(operation: ClrNavigateOperation): PreparedNavigation | Refused {
    if (!this.router?.config.length) {
      return { refused: 'noRoute', detail: 'The application has no routes.' };
    }
    const routes = availableRoutes(this.router.config, Number.MAX_SAFE_INTEGER);
    if (typeof operation.path !== 'string' || !routes.some(route => route.path === operation.path)) {
      return {
        refused: 'noRoute',
        detail: 'The path is not a route of this application. Use a path as availableRoutes lists it.',
      };
    }
    const filled = fillRoutePath(operation.path, plainStrings(operation.params));
    if (filled.missing !== undefined) {
      return { refused: 'invalid', detail: `The route needs a value for its "${filled.missing}" parameter.` };
    }
    if (filled.invalid !== undefined) {
      return { refused: 'invalid', detail: `The "${filled.invalid}" parameter cannot be "." or "..".` };
    }
    const queryParams = plainStrings(operation.queryParams);
    const url = this.router.serializeUrl(urlTreeFor(filled.segments, queryParams));
    const target: ClrMutationTarget = { operation: 'navigate', path: operation.path, url, queryParams };
    return {
      kind: 'navigate',
      operation,
      target,
      consequence: this.classify(target),
      router: this.router,
      segments: filled.segments,
    };
  }

  private async navigate(prepared: PreparedNavigation): Promise<ClrNavigationMutationResult> {
    const { operation, router, segments, target } = prepared;
    const report = await this.zone.run(() =>
      navigateAndReport(router, urlTreeFor(segments, target.queryParams), this.zone)
    );
    const result: ClrNavigationMutationResult = {
      operation: 'navigate',
      path: operation.path,
      applied: report.outcome === 'navigated' || report.outcome === 'redirected' || report.outcome === 'unchanged',
      outcome: report.outcome,
      url: report.url,
    };
    if (report.detail) {
      result.detail = report.detail;
    }
    return result;
  }

  private classify(target: ClrMutationTarget): ClrMutationConsequence {
    const verdict = attempt(() => this.policy?.classify(target), 'forbidden');
    return verdict === 'reversible' || verdict === 'consequential' ? verdict : 'forbidden';
  }

  private verdict(consequence: ClrMutationConsequence): Refused | null {
    if (consequence === 'forbidden') {
      return { refused: 'forbidden', detail: 'The application forbids this operation.' };
    }
    if (consequence === 'consequential' && !this.policy?.confirm) {
      return {
        refused: 'unconfirmed',
        detail: 'The application calls this consequential and has no way to confirm it.',
      };
    }
    return null;
  }
}

type Prepared = PreparedWrite | PreparedNavigation;

interface PreparedWrite {
  kind: 'write';
  operation: ClrSetValueOperation | ClrClearOperation;
  target: ClrMutationTarget;
  consequence: ClrMutationConsequence;
  write: WriteTarget;
  coerced: { value: unknown; display: unknown; bound?: unknown[] };
}

interface PreparedNavigation {
  kind: 'navigate';
  operation: ClrNavigateOperation;
  target: ClrMutationTarget;
  consequence: ClrMutationConsequence;
  router: Router;
  segments: string[];
}

interface Refused {
  refused: ClrMutationRefusal;
  detail: string;
}

function unforeseen(error: unknown): string {
  return `The operation could not be carried out: ${error instanceof Error ? error.message : 'an unexpected error'}.`;
}

function withoutSnapshots(change: ClrContextChange): ClrMutationChanges {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { previous, current, ...changes } = change;
  return changes;
}

/** Same element, label and value: a field relabelled in place is not what the person agreed to fill. */
function sameOperation(confirmed: Prepared, now: Prepared): boolean {
  return (
    confirmed.consequence === now.consequence &&
    confirmed.target.element === now.target.element &&
    confirmed.target.label === now.target.label &&
    (confirmed.kind !== 'write' || now.kind !== 'write' || confirmed.write.shownLabel === now.write.shownLabel) &&
    confirmed.target.type === now.target.type &&
    confirmed.target.url === now.target.url &&
    JSON.stringify(confirmed.target.value ?? null) === JSON.stringify(now.target.value ?? null) &&
    sameValue(coercedValue(confirmed), coercedValue(now)) &&
    sameBindings(confirmed, now)
  );
}

/** The same option elements can be bound to other values by the time the user confirms. */
function sameBindings(confirmed: Prepared, now: Prepared): boolean {
  const before = confirmed.kind === 'write' ? (confirmed.coerced.bound ?? []) : [];
  const after = now.kind === 'write' ? (now.coerced.bound ?? []) : [];
  return before.length === after.length && before.every((value, index) => Object.is(value, after[index]));
}

function coercedValue(prepared: Prepared): unknown {
  return prepared.kind === 'write' ? prepared.coerced.value : undefined;
}

/** Two options with the same label are different choices. */
function sameValue(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((entry, index) => sameValue(entry, b[index]));
  }
  if (Object.is(a, b)) {
    return true;
  }
  const plainData = (value: unknown) =>
    value === null || typeof value !== 'object' || Object.getPrototypeOf(value) === Object.prototype;
  return plainData(a) && plainData(b) && JSON.stringify(a) === JSON.stringify(b);
}

function refusal(operation: ClrMutationOperation, refused: ClrMutationRefusal, detail: string): ClrMutationResult {
  if (operation?.operation === 'navigate') {
    return { operation: 'navigate', path: String(operation.path ?? ''), applied: false, refused, detail };
  }
  const result: ClrElementMutationResult = {
    operation: operation?.operation === 'clear' ? 'clear' : 'setValue',
    ref: typeof operation?.ref === 'string' ? operation.ref : '',
    applied: false,
    refused,
    detail,
  };
  return result;
}

function listOf(operations: unknown): ClrMutationOperation[] {
  return Array.isArray(operations) ? operations : [];
}

function plainStrings(value: unknown): Record<string, string> {
  const result: Record<string, string> = {};
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, entry] of Object.entries(value)) {
      if (typeof entry === 'string' || typeof entry === 'number' || typeof entry === 'boolean') {
        result[key] = String(entry);
      }
    }
  }
  return result;
}

/** The `ngModel` in a component template writes its view in a resolved promise, so wait two turns. */
function settle(zone: NgZone): Promise<void> {
  return new Promise(resolve => zone.runOutsideAngular(() => setTimeout(() => setTimeout(resolve))));
}

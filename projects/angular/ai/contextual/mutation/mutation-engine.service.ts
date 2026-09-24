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
} from './mutation.interface';
import { fillRoutePath, navigateAndReport, urlTreeFor } from './navigate';
import {
  coerceValue,
  descriptionMatches,
  markViewForCheck,
  resolveWriteTarget,
  WriteOutcome,
  WriteTarget,
  writeValue,
} from './write';
import { ClrContextChange, diffClrContext } from '../diff';
import { ClrContextSnapshotOptions } from '../interfaces/context.interface';
import { ClrContextEngineService } from '../providers/contextual-engine.service';
import { availableRoutes } from '../routes';

/**
 * The write half of the contextual engine: gives form controls values and navigates,
 * on behalf of an AI agent, from the refs and routes the read half's snapshots carry.
 *
 * It never writes anything a snapshot would not show, never a redacted control, never
 * a control without an Angular form binding, and never without the application's
 * {@link ClrMutationPolicy}; and it only ever fills — it does not submit, click or
 * invoke, which stay with the user. Every result says what is true afterwards, so an
 * agent learns of a rejected value or a redirected navigation from the operation
 * itself rather than from a later surprise.
 *
 * Available to application code only: neither the global accessor nor the frame bridge
 * exposes it.
 */
@Injectable({ providedIn: 'root' })
export class ClrMutationEngineService {
  private readonly contextEngine = inject(ClrContextEngineService);
  private readonly refs = inject(ContextRefRegistryService);
  private readonly policy = inject(CLR_MUTATION_POLICY, { optional: true });
  private readonly router = inject(Router, { optional: true });
  private readonly zone = inject(NgZone);
  private readonly application = inject(ApplicationRef);
  // Batches run one after another: a second agent turn must not interleave its writes
  // with the first, nor measure its changes against a page the first is still changing.
  private queue: Promise<unknown> = Promise.resolve();

  /**
   * What applying the operations would do, without doing any of it: each target
   * resolved, classified and its value translated, or the refusal it would meet.
   */
  plan(operations: ClrMutationOperation[]): ClrMutationPlanEntry[] {
    return operations.map(operation => {
      const prepared = this.prepare(operation);
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

  /**
   * Applies the operations in order and reports what each did, followed by a fresh
   * snapshot and what changed since just before the first operation, both taken with
   * `snapshotOptions`. A refused or failing operation does not stop the ones after it.
   */
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
    const results: ClrMutationResult[] = [];
    for (const operation of Array.isArray(operations) ? operations : []) {
      results.push(await this.applyOne(operation));
    }
    // Brings every view that shows a written value up to date — a zoneless application,
    // or a write made from outside the zone, would otherwise show the old one — then
    // lets whatever the application schedules itself run before the page is read back.
    this.zone.run(() => this.application.tick());
    await settle();
    const snapshot = this.contextEngine.getSnapshot(snapshotOptions);
    const report: ClrMutationReport = {
      results,
      snapshot,
      changes: withoutSnapshots(diffClrContext(before, snapshot)),
    };
    try {
      this.policy?.announce?.(report);
    } catch {
      // The application's announcement failing must not lose the report.
    }
    return report;
  }

  private async applyOne(operation: ClrMutationOperation): Promise<ClrMutationResult> {
    let prepared = this.prepare(operation);
    if ('refused' in prepared) {
      return refusal(operation, prepared.refused, prepared.detail);
    }
    const blocked = this.verdict(prepared.consequence);
    if (blocked) {
      return refusal(operation, blocked.refused, blocked.detail);
    }
    if (prepared.consequence === 'consequential') {
      let confirmed = false;
      try {
        confirmed = (await this.policy?.confirm?.(prepared.target)) === true;
      } catch {
        confirmed = false;
      }
      if (!confirmed) {
        return refusal(operation, 'declined', 'The application declined the operation.');
      }
      // The person agreed to what they were shown. The page may have moved on while they
      // looked — the field disabled, hidden, re-rendered — so it is checked again, and
      // written only if it is still exactly what they agreed to.
      const again = this.prepare(operation);
      if ('refused' in again) {
        return refusal(operation, again.refused, again.detail);
      }
      if (!sameOperation(prepared, again)) {
        return refusal(
          operation,
          'stale',
          'The page changed while the operation waited for confirmation. Take a new snapshot and ask again.'
        );
      }
      prepared = again;
    }
    if (operation.operation === 'navigate') {
      return this.navigate(operation, prepared);
    }
    const write = prepared.write as WriteTarget;
    let outcome: WriteOutcome;
    try {
      outcome = this.zone.run(() => writeValue(write, prepared.coerced as { value: unknown; display: unknown }));
    } catch (error) {
      // A control's own code threw — a value accessor, a validator. Reported against this
      // operation, so the ones before it keep their results and the ones after still run.
      outcome = {
        applied: false,
        refused: 'invalid',
        detail: error instanceof Error ? error.message : 'The control failed to take the value.',
      };
    }
    markViewForCheck(write.element);
    return { operation: operation.operation, ref: operation.ref, ...outcome };
  }

  /** Everything up to, but not including, the write: the target, the value, the verdict. */
  private prepare(operation: ClrMutationOperation): Prepared | Refused {
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
    const ref = typeof operation.ref === 'string' ? this.refs.resolve(operation.ref) : null;
    if (!ref) {
      return {
        refused: 'stale',
        detail: 'The ref does not name anything on the page. Take a new snapshot and use its refs.',
      };
    }
    const resolution = resolveWriteTarget(ref, this.application);
    if ('refused' in resolution) {
      return resolution;
    }
    const write = resolution.target;
    if (!descriptionMatches(operation.description, write.label, write.type)) {
      return {
        refused: 'mismatch',
        detail: write.label
          ? `The node is "${write.label}", not "${String(operation.description)}". Take a new snapshot and use its refs.`
          : 'The node has no name; describe it by what it is, or leave the description empty.',
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
      modelValue: coerced.value,
    };
    return {
      target,
      consequence: this.classify(target),
      write,
      coerced: { value: coerced.value, display: coerced.display },
    };
  }

  private prepareNavigation(operation: ClrNavigateOperation): Prepared | Refused {
    if (!this.router?.config.length) {
      return { refused: 'noRoute', detail: 'The application has no routes.' };
    }
    const routes = availableRoutes(this.router.config, Number.MAX_SAFE_INTEGER);
    if (typeof operation.path !== 'string' || !routes.some(route => route.path === operation.path)) {
      return {
        refused: 'noRoute',
        detail: 'The path is not one of the routes the snapshot listed under availableRoutes.',
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
    return { target, consequence: this.classify(target), segments: filled.segments };
  }

  private async navigate(operation: ClrNavigateOperation, prepared: Prepared): Promise<ClrNavigationMutationResult> {
    const router = this.router;
    if (!router || !prepared.segments) {
      return refusal(operation, 'noRoute', 'The application has no routes.') as ClrNavigationMutationResult;
    }
    const tree = urlTreeFor(prepared.segments, prepared.target.queryParams);
    const report = await this.zone.run(() => navigateAndReport(router, tree));
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

  /** The policy's verdict, with a throw or an unknown answer treated as forbidden. */
  private classify(target: ClrMutationTarget): ClrMutationConsequence {
    try {
      const verdict = this.policy?.classify(target);
      return verdict === 'reversible' || verdict === 'consequential' ? verdict : 'forbidden';
    } catch {
      return 'forbidden';
    }
  }

  /**
   * The refusal a verdict alone decides, before anyone is asked: forbidden, or
   * consequential with no way to confirm. The same answer for `plan()` and `apply()`.
   */
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

interface Prepared {
  target: ClrMutationTarget;
  consequence: ClrMutationConsequence;
  write?: WriteTarget;
  coerced?: { value: unknown; display: unknown };
  segments?: string[];
}

interface Refused {
  refused: ClrMutationRefusal;
  detail: string;
}

/** A change without the two snapshots it compared: the report already carries the later one. */
function withoutSnapshots(change: ClrContextChange): ClrMutationChanges {
  const changes: Partial<ClrContextChange> = { ...change };
  delete changes.previous;
  delete changes.current;
  return changes as ClrMutationChanges;
}

/** Whether a re-prepared operation is still the one that was confirmed. */
function sameOperation(confirmed: Prepared, now: Prepared): boolean {
  return (
    confirmed.consequence === now.consequence &&
    confirmed.target.element === now.target.element &&
    confirmed.target.url === now.target.url &&
    JSON.stringify(confirmed.target.value ?? null) === JSON.stringify(now.target.value ?? null)
  );
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

/** Only the string entries of what may be an agent's loosely typed object. */
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

/**
 * Lets the application catch up with what was written before anything is read back for
 * the report: whatever it scheduled itself — the `ngModel` inside a component's
 * template, which writes its view in a resolved promise — runs within two turns of the
 * event loop.
 */
function settle(): Promise<void> {
  return new Promise(resolve => setTimeout(() => setTimeout(resolve)));
}

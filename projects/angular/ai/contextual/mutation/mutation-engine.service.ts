/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  CLR_MUTATION_POLICY,
  ClrElementMutationResult,
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
import { fillRoutePath, navigateAndReport } from './navigate';
import { ClrContextRefRegistry } from './ref-registry';
import { ClrWriteTarget, coerceValue, descriptionMatches, resolveWriteTarget, writeValue } from './write';
import { diffClrContext } from '../diff';
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
  private readonly refs = inject(ClrContextRefRegistry);
  private readonly policy = inject(CLR_MUTATION_POLICY, { optional: true });
  private readonly router = inject(Router, { optional: true });

  /**
   * What applying the operations would do, without doing any of it: each target
   * resolved, classified and its value coerced, or the refusal it would meet.
   */
  plan(operations: ClrMutationOperation[]): ClrMutationPlanEntry[] {
    return operations.map(operation => {
      const prepared = this.prepare(operation);
      if ('refused' in prepared) {
        return { operation, refused: prepared.refused, detail: prepared.detail };
      }
      const entry: ClrMutationPlanEntry = { operation, target: prepared.target, consequence: prepared.consequence };
      if (prepared.consequence === 'forbidden') {
        entry.refused = 'forbidden';
        entry.detail = 'The application forbids this operation.';
      }
      return entry;
    });
  }

  /**
   * Applies the operations in order and reports what each did, followed by a fresh
   * snapshot and the difference from the one before. A refused operation does not stop
   * the ones after it; a navigation usually leaves every ref after it stale, which the
   * results then say.
   */
  async apply(operations: ClrMutationOperation[]): Promise<ClrMutationReport> {
    const before = this.contextEngine.latestSnapshot;
    const results: ClrMutationResult[] = [];
    for (const operation of operations) {
      results.push(await this.applyOne(operation));
    }
    await settle();
    const snapshot = this.contextEngine.getSnapshot(this.contextEngine.latestSnapshotOptions ?? undefined);
    return { results, snapshot, changes: diffClrContext(before, snapshot) };
  }

  private async applyOne(operation: ClrMutationOperation): Promise<ClrMutationResult> {
    const prepared = this.prepare(operation);
    if ('refused' in prepared) {
      return refusal(operation, prepared.refused, prepared.detail);
    }
    const { target, consequence } = prepared;
    if (consequence === 'forbidden') {
      return refusal(operation, 'forbidden', 'The application forbids this operation.');
    }
    if (consequence === 'consequential') {
      if (!this.policy?.confirm) {
        return refusal(
          operation,
          'unconfirmed',
          'The application calls this consequential and has no way to confirm it.'
        );
      }
      let confirmed = false;
      try {
        confirmed = await this.policy.confirm(target);
      } catch {
        confirmed = false;
      }
      if (!confirmed) {
        return refusal(operation, 'declined', 'The application declined the operation.');
      }
    }
    if (operation.operation === 'navigate') {
      return this.navigate(operation, target.url ?? '');
    }
    const result = writeValue(prepared.write, prepared.coerced);
    result.operation = operation.operation;
    result.ref = operation.ref;
    if (result.refused) {
      result.refused = 'invalid';
    }
    return result;
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
    if (!ref || !ref.elements.every(element => element.isConnected)) {
      return {
        refused: 'stale',
        detail: 'The ref is not in the latest snapshot. Take a new snapshot and use its refs.',
      };
    }
    const resolution = resolveWriteTarget(ref);
    if ('refused' in resolution) {
      return resolution;
    }
    const write = resolution.target;
    if (!descriptionMatches(operation.description, write.label)) {
      return {
        refused: 'mismatch',
        detail: `The node is "${write.label}", not "${String(operation.description)}". Take a new snapshot and use its refs.`,
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
      value: coerced.value,
    };
    return { target, consequence: this.classify(target), write, coerced: coerced.value };
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
    const queryParams = plainStrings(operation.queryParams);
    const tree = this.router.createUrlTree([filled.url], Object.keys(queryParams).length ? { queryParams } : {});
    const url = this.router.serializeUrl(tree);
    const target: ClrMutationTarget = { operation: 'navigate', path: operation.path, url };
    return { target, consequence: this.classify(target), url: tree };
  }

  private async navigate(operation: ClrNavigateOperation, url: string): Promise<ClrNavigationMutationResult> {
    const router = this.router;
    if (!router) {
      return refusal(operation, 'noRoute', 'The application has no routes.') as ClrNavigationMutationResult;
    }
    const report = await navigateAndReport(router, router.parseUrl(url));
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
}

interface Prepared {
  target: ClrMutationTarget;
  consequence: ClrMutationConsequence;
  write?: ClrWriteTarget;
  coerced?: unknown;
  url?: import('@angular/router').UrlTree;
}

interface Refused {
  refused: ClrMutationRefusal;
  detail: string;
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
 * the report. A zoned application runs change detection when the current task's
 * microtasks drain; a zoneless one schedules it as a task of its own. Two turns of the
 * event loop cover both, and the `ngModel` inside a component's template, which writes
 * its view in a resolved promise.
 */
function settle(): Promise<void> {
  return new Promise(resolve => setTimeout(() => setTimeout(resolve)));
}

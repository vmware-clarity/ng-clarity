/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { attempt, TIMED_OUT, usableTimeout, withTimeout } from '../attempt';
import { ClrComponentContext, ClrContextProvider } from '../interfaces/context.interface';
import { jsonSafe, REGION_DEPTH } from '../json-safe';

/** Decides, from the element an annotation sits on, whether it is kept, dropped or stripped of state. */
export type ClrContextRegionFilter = (element: Element | null) => 'keep' | 'drop' | 'redact';

/** Registry of live context providers; they are polled at snapshot time, so nothing goes stale. */
@Injectable({ providedIn: 'root' })
export class ClrContextRegistryService {
  /** Emits when a provider joins, leaves or reports a change, which may not touch the DOM. */
  readonly changes$: Observable<void>;

  private readonly providers: ClrContextProvider[] = [];
  private readonly elements = new WeakMap<ClrContextProvider, Element>();
  private readonly changesSubject = new Subject<void>();
  /** Answers still pending, shared by every snapshot taken until they settle. */
  private readonly pending = new Map<ClrContextProvider, Promise<ClrComponentContext | null>>();

  constructor() {
    this.changes$ = this.changesSubject.asObservable();
  }

  /** Registers a provider and returns its teardown; with `element`, it follows that element's visibility. */
  register(provider: ClrContextProvider, element?: Element): () => void {
    if (element) {
      this.elements.set(provider, element);
    }
    if (!this.providers.includes(provider)) {
      this.providers.push(provider);
      this.changesSubject.next();
    }
    return () => this.unregister(provider);
  }

  /** Removes a provider, typically from `ngOnDestroy`. */
  unregister(provider: ClrContextProvider): void {
    const index = this.providers.indexOf(provider);
    if (index > -1) {
      this.providers.splice(index, 1);
      this.pending.delete(provider);
      this.changesSubject.next();
    }
  }

  /** Tells whoever is keeping a snapshot current that a provider's contribution changed. */
  notifyChanged(): void {
    this.changesSubject.next();
  }

  /** Polls live providers, skipping ones that return `null` or throw; a pending one is reported as loading. */
  collect(filter?: ClrContextRegionFilter): ClrComponentContext[] {
    return this.poll(filter).flatMap(({ result, verdict }) =>
      isPromise(result) ? [{ type: CLR_CONTEXT_LOADING_TYPE }] : listOf(reported(result, verdict))
    );
  }

  /**
   * Like {@link collect}, awaiting each pending provider for up to `timeoutMs` (2 seconds by default).
   * One that fails or takes longer is reported as unavailable; one that answers is filtered again, as
   * its element may have moved in the meantime.
   */
  async collectAsync(options: ClrContextAsyncCollectOptions = {}): Promise<ClrComponentContext[]> {
    const { filter } = options;
    const timeoutMs = usableTimeout(options.timeoutMs, DEFAULT_TIMEOUT_MS);
    const settled = await Promise.all(
      this.poll(filter).map(async ({ provider, result, verdict }) => {
        if (!isPromise(result)) {
          return listOf(reported(result, verdict));
        }
        const answer = await withTimeout(result, timeoutMs).catch((): typeof TIMED_OUT => TIMED_OUT);
        if (answer === TIMED_OUT) {
          return [{ type: CLR_CONTEXT_UNAVAILABLE_TYPE }];
        }
        const current = filter ? attempt(() => filter(this.elements.get(provider) ?? null), 'drop') : 'keep';
        return current === 'drop' ? [] : listOf(reported(answer, current));
      })
    );
    return settled.flat();
  }

  private poll(filter?: ClrContextRegionFilter): PolledProvider[] {
    const polled: PolledProvider[] = [];
    for (const provider of this.providers) {
      try {
        const verdict = filter ? filter(this.elements.get(provider) ?? null) : 'keep';
        if (verdict !== 'drop') {
          polled.push({ provider, result: this.ask(provider), verdict });
        }
      } catch {
        // A faulty provider must not break the whole snapshot.
      }
    }
    return polled;
  }

  /** The provider's answer; while an earlier answer is pending, that one, so a slow provider is not asked again. */
  private ask(provider: ClrContextProvider): ClrComponentContext | null | Promise<ClrComponentContext | null> {
    const waiting = this.pending.get(provider);
    if (waiting) {
      return waiting;
    }
    const result = provider.getClrContext();
    if (!isPromise(result)) {
      return result;
    }
    // `Promise.resolve` adopts any thenable, including one without `catch` or with a throwing `then`.
    const answer = Promise.resolve(result).finally(() => this.pending.delete(provider));
    answer.catch(() => undefined);
    this.pending.set(provider, answer);
    return answer;
  }
}

/** How {@link ClrContextRegistryService.collectAsync} collects. */
export interface ClrContextAsyncCollectOptions {
  /** Decides from each provider's element whether it is kept, dropped or stripped of state. */
  filter?: ClrContextRegionFilter;
  /** How long to wait for each pending provider. Default `2000`. */
  timeoutMs?: number;
}

/** Type of the placeholder region reported for a provider whose answer is pending. */
export const CLR_CONTEXT_LOADING_TYPE = 'clr-loading';

/** Type of the placeholder region reported for a provider that failed or did not answer in time. */
export const CLR_CONTEXT_UNAVAILABLE_TYPE = 'clr-unavailable';

const DEFAULT_TIMEOUT_MS = 2000;

interface PolledProvider {
  provider: ClrContextProvider;
  result: ClrComponentContext | null | Promise<ClrComponentContext | null>;
  verdict: 'keep' | 'redact';
}

function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
  return typeof (value as Promise<T> | null)?.then === 'function';
}

function reported(context: ClrComponentContext | null, verdict: 'keep' | 'redact'): ClrComponentContext | null {
  const copy = attempt(() => copied(context), null);
  return copy && verdict === 'redact' ? withheldState(copy) : copy;
}
function listOf(context: ClrComponentContext | null): ClrComponentContext[] {
  return context ? [context] : [];
}

function copied(context: ClrComponentContext | null): ClrComponentContext | null {
  return componentNode(jsonSafe(context, REGION_DEPTH, true));
}

/** The fields a component context has, recursively; anything else would fall outside the published schema. */
function componentNode(value: unknown): ClrComponentContext | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  const source = value as Record<string, unknown>;
  if (typeof source['type'] !== 'string') {
    return null;
  }
  const node: ClrComponentContext = { type: source['type'] };
  if (typeof source['element'] === 'string') {
    node.element = source['element'];
  }
  if (typeof source['label'] === 'string') {
    node.label = source['label'];
  }
  if (source['state'] && typeof source['state'] === 'object' && !Array.isArray(source['state'])) {
    node.state = source['state'] as Record<string, unknown>;
  }
  if (Array.isArray(source['children'])) {
    node.children = source['children'].map(componentNode).filter((child): child is ClrComponentContext => !!child);
  }
  return node;
}

function withheldState(context: ClrComponentContext): ClrComponentContext {
  const reported: ClrComponentContext = { type: context.type, state: { redacted: true } };
  if (context.label) {
    reported.label = context.label;
  }
  return reported;
}

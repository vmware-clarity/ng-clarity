/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

import { attempt, TIMED_OUT, usableTimeout, withTimeout } from '../attempt';
import { ClrComponentContext, ClrContextProvider, ClrPublishedContext } from '../interfaces/context.interface';
import { jsonSafe, REGION_DEPTH } from '../json-safe';
import type { ResolvedSnapshotOptions } from '../snapshot-options';

/**
 * Registry of live context providers for what no element shows, such as the signed-in user's role; they are
 * polled at snapshot time, so nothing goes stale. Context about an element goes on it with `[clrContext]`.
 */
@Injectable({ providedIn: 'root' })
export class ClrContextRegistryService {
  private readonly providers: ClrContextProvider[] = [];
  /** Answers still pending, shared by every snapshot taken until they settle. */
  private readonly pending = new Map<ClrContextProvider, Promise<ClrPublishedContext | null>>();

  /** Registers a provider and returns its teardown. */
  register(provider: ClrContextProvider): () => void {
    if (!this.providers.includes(provider)) {
      this.providers.push(provider);
    }
    return () => this.unregister(provider);
  }

  /** Removes a provider, typically from `ngOnDestroy`. */
  unregister(provider: ClrContextProvider): void {
    const index = this.providers.indexOf(provider);
    if (index > -1) {
      this.providers.splice(index, 1);
      this.pending.delete(provider);
    }
  }

  /** Polls live providers, skipping ones that return `null` or throw; a pending one is reported as loading. */
  collect(options: ClrContextCollectOptions = {}): ClrComponentContext[] {
    return this.poll().flatMap(({ result }) =>
      isPromise(result) ? [{ type: CLR_CONTEXT_LOADING_TYPE }] : listOf(reported(result, options))
    );
  }

  /**
   * Like {@link collect}, awaiting each pending provider for up to `timeoutMs` (2 seconds by default).
   * One that fails or takes longer is reported as unavailable, and one unregistered meanwhile is left out.
   */
  async collectAsync(options: ClrContextAsyncCollectOptions = {}): Promise<ClrComponentContext[]> {
    const timeoutMs = usableTimeout(options.timeoutMs, DEFAULT_TIMEOUT_MS);
    const polled = this.poll();
    const answers = await Promise.all(
      polled.map(({ provider, result }) => (isPromise(result) ? this.settle(provider, result, timeoutMs) : result))
    );
    return polled.flatMap(({ provider }, index) => {
      const answer = answers[index];
      if (!this.providers.includes(provider)) {
        return [];
      }
      return answer === TIMED_OUT ? [{ type: CLR_CONTEXT_UNAVAILABLE_TYPE }] : listOf(reported(answer, options));
    });
  }

  private async settle(
    provider: ClrContextProvider,
    result: Promise<ClrPublishedContext | null>,
    timeoutMs: number
  ): Promise<ClrPublishedContext | null | typeof TIMED_OUT> {
    const answer = await withTimeout(result, timeoutMs).catch((): typeof TIMED_OUT => TIMED_OUT);
    // Asked again next time: an answer that never settles must not stand for every later one.
    if (answer === TIMED_OUT && this.pending.get(provider) === result) {
      this.pending.delete(provider);
    }
    return answer;
  }

  private poll(): PolledProvider[] {
    const polled: PolledProvider[] = [];
    for (const provider of this.providers) {
      try {
        polled.push({ provider, result: this.ask(provider) });
      } catch {
        // A faulty provider must not break the whole snapshot.
      }
    }
    return polled;
  }

  /** The provider's answer; while an earlier answer is pending, that one, so a slow provider is not asked again. */
  private ask(provider: ClrContextProvider): ClrPublishedContext | null | Promise<ClrPublishedContext | null> {
    const waiting = this.pending.get(provider);
    if (waiting) {
      return waiting;
    }
    const result = provider.getClrContext();
    if (!isPromise(result)) {
      return result;
    }
    // `Promise.resolve` adopts any thenable, including one without `catch` or with a throwing `then`.
    // Only its own entry: once it timed out, a newer answer may be pending in its place.
    const answer: Promise<ClrPublishedContext | null> = Promise.resolve(result).finally(() => {
      if (this.pending.get(provider) === answer) {
        this.pending.delete(provider);
      }
    });
    answer.catch((): void => undefined);
    this.pending.set(provider, answer);
    return answer;
  }
}

/** How {@link ClrContextRegistryService.collect} collects. */
export interface ClrContextCollectOptions {
  /** Cuts text in what providers report. */
  limits?: ClrContextRegionLimits;
}

/** How {@link ClrContextRegistryService.collectAsync} collects. */
export interface ClrContextAsyncCollectOptions extends ClrContextCollectOptions {
  /** How long to wait for each pending provider. Default `2000`. */
  timeoutMs?: number;
}

/** How long text in a provider's report may be. */
export type ClrContextRegionLimits = Pick<ResolvedSnapshotOptions, 'maxTextLength'>;

/** Type of the placeholder region reported for a provider whose answer is pending. */
export const CLR_CONTEXT_LOADING_TYPE = 'clr-loading';

/** Type of the placeholder region reported for a provider that failed or did not answer in time. */
export const CLR_CONTEXT_UNAVAILABLE_TYPE = 'clr-unavailable';

const DEFAULT_TIMEOUT_MS = 2000;

interface PolledProvider {
  provider: ClrContextProvider;
  result: ClrPublishedContext | null | Promise<ClrPublishedContext | null>;
}

function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
  return typeof (value as Promise<T> | null)?.then === 'function';
}

function reported(context: ClrPublishedContext | null, options: ClrContextCollectOptions): ClrComponentContext | null {
  return attempt(() => copied(context, options), null);
}

function listOf(context: ClrComponentContext | null): ClrComponentContext[] {
  return context ? [context] : [];
}

function copied(context: ClrPublishedContext | null, options: ClrContextCollectOptions): ClrComponentContext | null {
  return componentNode(jsonSafe(context, REGION_DEPTH, true, options.limits));
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
  const published = source['state'];
  if (published && typeof published === 'object' && !Array.isArray(published)) {
    if (Object.keys(published).length) {
      node.state = published as Record<string, unknown>;
    }
  }
  if (Array.isArray(source['children'])) {
    node.children = source['children']
      .map(child => componentNode(child))
      .filter((child): child is ClrComponentContext => !!child);
  }
  return node;
}

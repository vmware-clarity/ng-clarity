/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { attempt } from '../attempt';
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
      this.changesSubject.next();
    }
  }

  /** Tells whoever is keeping a snapshot current that a provider's contribution changed. */
  notifyChanged(): void {
    this.changesSubject.next();
  }

  /** Polls live providers, skipping ones that return `null` or throw; a pending promise is reported as loading. */
  collect(filter?: ClrContextRegionFilter): ClrComponentContext[] {
    return this.poll(filter).flatMap(({ result, verdict }) => {
      if (!isPromise(result)) {
        return listOf(reported(result, verdict));
      }
      result.catch(() => undefined);
      return [{ type: 'region', state: { loading: true } }];
    });
  }

  /** Like {@link collect}, awaiting each promise for up to `timeoutMs`; one that takes longer is reported as unavailable. */
  async collectAsync(filter: ClrContextRegionFilter | undefined, timeoutMs: number): Promise<ClrComponentContext[]> {
    const settled = await Promise.all(
      this.poll(filter).map(async ({ result, verdict }) => {
        if (!isPromise(result)) {
          return listOf(reported(result, verdict));
        }
        const resolved = await withTimeout(result, timeoutMs).catch(() => null);
        return resolved === TIMED_OUT
          ? [{ type: 'region', state: { unavailable: true } }]
          : listOf(reported(resolved, verdict));
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
          polled.push({ result: provider.getClrContext(), verdict });
        }
      } catch {
        // A faulty provider must not break the whole snapshot.
      }
    }
    return polled;
  }
}

interface PolledProvider {
  result: ReturnType<ClrContextProvider['getClrContext']>;
  verdict: 'keep' | 'redact';
}

const TIMED_OUT = Symbol('timed out');

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T | typeof TIMED_OUT> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<typeof TIMED_OUT>(resolve => (timer = setTimeout(() => resolve(TIMED_OUT), timeoutMs)));
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
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
  const copy = jsonSafe(context, REGION_DEPTH, true) as ClrComponentContext | undefined;
  return copy && typeof copy === 'object' && typeof copy.type === 'string' ? copy : null;
}

function withheldState(context: ClrComponentContext): ClrComponentContext {
  const reported: ClrComponentContext = { type: context.type, state: { redacted: true } };
  if (context.label) {
    reported.label = context.label;
  }
  return reported;
}

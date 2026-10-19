/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

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

  /** Polls live providers, skipping ones that return `null` or throw, and returns detached copies. */
  collect(filter?: ClrContextRegionFilter): ClrComponentContext[] {
    const contexts: ClrComponentContext[] = [];
    for (const provider of this.providers) {
      try {
        const verdict = filter ? filter(this.elements.get(provider) ?? null) : 'keep';
        if (verdict === 'drop') {
          continue;
        }
        const context = copied(provider.getClrContext());
        if (context) {
          contexts.push(verdict === 'redact' ? withheldState(context) : context);
        }
      } catch {
        // A faulty provider must not break the whole snapshot.
      }
    }
    return contexts;
  }
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

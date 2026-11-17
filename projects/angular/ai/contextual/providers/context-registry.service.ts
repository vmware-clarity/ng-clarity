/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { attempt } from '../attempt';
import { ClrComponentContext, ClrContextProvider, ClrPublishedContext } from '../interfaces/context.interface';
import { jsonSafe, REGION_DEPTH } from '../json-safe';
import { publicState } from '../public-keys';
import type { ResolvedSnapshotOptions } from '../snapshot-options';

/**
 * Registry of live context providers for what no element shows, such as the signed-in user's role; they are
 * polled at snapshot time, so nothing goes stale. Context about an element goes on it with `[clrContext]`.
 */
@Injectable({ providedIn: 'root' })
export class ClrContextRegistryService {
  /** Emits when a provider joins, leaves or reports a change, which may not touch the DOM. */
  readonly changes$: Observable<void>;

  private readonly providers: ClrContextProvider[] = [];
  private readonly changesSubject = new Subject<void>();

  constructor() {
    this.changes$ = this.changesSubject.asObservable();
  }

  /** Registers a provider and returns its teardown. */
  register(provider: ClrContextProvider): () => void {
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

  /** Polls live providers, skipping ones that return `null` or throw. */
  collect(options: ClrContextCollectOptions = {}): ClrComponentContext[] {
    const collected: ClrComponentContext[] = [];
    for (const provider of this.providers) {
      try {
        const context = attempt(() => copied(provider.getClrContext(), options), null);
        if (context) {
          collected.push(context);
        }
      } catch {
        // A faulty provider must not break the whole snapshot.
      }
    }
    return collected;
  }
}

/** How {@link ClrContextRegistryService.collect} collects. */
export interface ClrContextCollectOptions {
  /** Cuts text and lists in what providers report. */
  limits?: ClrContextRegionLimits;
  /** For a caller the application does not control: state is cut to the keys each provider marks public. */
  untrusted?: boolean;
}

/** How long text and lists in a provider's report may be. */
export type ClrContextRegionLimits = Pick<ResolvedSnapshotOptions, 'maxTextLength' | 'maxItemsPerCollection'>;

function copied(context: ClrPublishedContext | null, options: ClrContextCollectOptions): ClrComponentContext | null {
  return componentNode(jsonSafe(context, REGION_DEPTH, true, options.limits), !!options.untrusted);
}

/** The fields a component context has, recursively; anything else would fall outside the published schema. */
function componentNode(value: unknown, untrusted: boolean): ClrComponentContext | null {
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
    const state = untrusted ? publicState(source, published as Record<string, unknown>) : published;
    if (Object.keys(state).length) {
      node.state = state as Record<string, unknown>;
    }
  }
  if (Array.isArray(source['children'])) {
    node.children = source['children']
      .map(child => componentNode(child, untrusted))
      .filter((child): child is ClrComponentContext => !!child);
  }
  return node;
}

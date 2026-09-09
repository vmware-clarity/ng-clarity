/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, Inject, Injectable, NgZone, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Observable, ReplaySubject, Subscription } from 'rxjs';

import { ClrContextRegistryService } from './context-registry.service';
import { ClrContextualEngineService } from './contextual-engine.service';
import { CLR_CONTEXT_IGNORE_ATTRIBUTE } from '../dom/dom-context-collector';
import { ClrContextSnapshotOptions, ClrPageContext } from '../interfaces/context.interface';

export interface ClrContextTrackingOptions {
  /** Budgets applied to every snapshot the tracker takes. */
  snapshot?: ClrContextSnapshotOptions;
  /**
   * Quiet window: the page is scraped this many milliseconds after the last observed
   * DOM change, so one user action (which typically produces a short burst of
   * mutations) results in one scrape. Default `300`.
   */
  debounceMs?: number;
  /**
   * Upper bound between the first unprocessed DOM change and the scrape, so pages
   * that never go quiet (animations, tickers) still get tracked. Default `2000`.
   */
  maxWaitMs?: number;
}

const DEFAULT_DEBOUNCE_MS = 300;
const DEFAULT_MAX_WAIT_MS = 2000;
const IGNORE_SELECTOR = `[${CLR_CONTEXT_IGNORE_ATTRIBUTE}]`;

/**
 * Maintains the current page context as a stream by watching the DOM itself: a
 * `MutationObserver` sees every change — route navigations, data arriving into a
 * datagrid, a modal opening, rows being selected — and the page is re-scraped after a
 * short quiet window, then emitted only if the context actually changed. Consumers
 * such as an AI chat panel subscribe to {@link context$} and always hold context
 * describing what the user currently sees, without polling and without any coupling to
 * the router or the rendering framework.
 *
 * Mutations inside elements marked with {@link CLR_CONTEXT_IGNORE_ATTRIBUTE} are
 * ignored (and the collector never describes those elements), so UI that renders the
 * context — the chat panel itself — neither triggers feedback loops nor describes
 * itself into the page context.
 *
 * `input` and `change` are watched as well as mutations, because typing changes a
 * property rather than an attribute and is invisible to a `MutationObserver`. So are
 * the application's own `clrContext` annotations, whose state lives outside the DOM.
 *
 * Every emission is a freshly computed snapshot of the live DOM at that moment — the
 * tracker stores only the latest emission and never merges or accumulates, so context
 * from a page that was navigated away from can never leak into the current one.
 */
@Injectable({ providedIn: 'root' })
export class ClrContextTrackerService implements OnDestroy {
  /** Emits the latest page context; replays the most recent snapshot to new subscribers. */
  readonly context$: Observable<ClrPageContext>;

  private readonly contextSubject = new ReplaySubject<ClrPageContext>(1);
  private trackingOptions: ClrContextTrackingOptions = {};
  private tracking = false;
  private observer: MutationObserver | null = null;
  private quietTimer: ReturnType<typeof setTimeout> | null = null;
  private maxWaitTimer: ReturnType<typeof setTimeout> | null = null;
  private valueListener: ((event: Event) => void) | null = null;
  private registrySubscription: Subscription | null = null;
  private latest: ClrPageContext | null = null;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: unknown,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly contextEngine: ClrContextualEngineService,
    private readonly contextRegistry: ClrContextRegistryService,
    private readonly zone: NgZone
  ) {
    this.context$ = this.contextSubject.asObservable();
  }

  /** The most recent snapshot the tracker has taken, or `null` before tracking starts. */
  get currentContext(): ClrPageContext | null {
    return this.latest;
  }

  ngOnDestroy(): void {
    this.stop();
    // Nothing outlives the injector that owned this service; the snapshot it was
    // holding — a description of the whole page — should not either.
    this.latest = null;
    this.contextSubject.complete();
  }

  /**
   * Starts tracking: takes an initial snapshot immediately, then re-scrapes whenever
   * the DOM changes. Calling it again restarts with the new options.
   */
  start(options: ClrContextTrackingOptions = {}): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.stop();
    this.tracking = true;
    this.trackingOptions = options;
    this.refresh();
    // Created outside the Angular zone: zone.js patches MutationObserver, and an
    // in-zone observer would trigger change detection on every mutation batch.
    this.zone.runOutsideAngular(() => {
      this.observer = new MutationObserver(records => this.onMutations(records));
      this.observer.observe(this.document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      // Typing changes an input's `value` property, never its attribute, so a
      // MutationObserver never sees it. Without these listeners a subscriber would hold
      // whatever the values were at the last unrelated DOM change.
      this.valueListener = event => this.onValueChange(event);
      this.document.body.addEventListener('input', this.valueListener, true);
      this.document.body.addEventListener('change', this.valueListener, true);

      // An annotation's state is application data, changed without any DOM change.
      this.registrySubscription = this.contextRegistry.changes.subscribe(() => this.scheduleScrape());
    });
  }

  /** Stops tracking. The last emitted context stays available to subscribers. */
  stop(): void {
    this.tracking = false;
    this.observer?.disconnect();
    this.observer = null;
    if (this.valueListener) {
      this.document.body.removeEventListener('input', this.valueListener, true);
      this.document.body.removeEventListener('change', this.valueListener, true);
      this.valueListener = null;
    }
    this.registrySubscription?.unsubscribe();
    this.registrySubscription = null;
    this.clearTimers();
  }

  /** Takes a fresh snapshot immediately and emits it. */
  refresh(): void {
    this.latest = this.contextEngine.getSnapshot(this.trackingOptions.snapshot);
    this.contextSubject.next(this.latest);
  }

  private onMutations(records: MutationRecord[]): void {
    if (records.every(record => isInsideIgnoredRegion(record.target))) {
      return;
    }
    this.scheduleScrape();
  }

  private onValueChange(event: Event): void {
    const target = event.target;
    if (target instanceof Node && isInsideIgnoredRegion(target)) {
      return;
    }
    this.scheduleScrape();
  }

  /**
   * Queues a scrape for after the page goes quiet. Mutations and value changes share one
   * window, so a burst of typing still results in a single scrape.
   */
  private scheduleScrape(): void {
    if (!this.tracking) {
      return;
    }
    if (this.quietTimer !== null) {
      clearTimeout(this.quietTimer);
    }
    this.quietTimer = setTimeout(() => this.scrape(), this.trackingOptions.debounceMs ?? DEFAULT_DEBOUNCE_MS);
    if (this.maxWaitTimer === null) {
      this.maxWaitTimer = setTimeout(() => this.scrape(), this.trackingOptions.maxWaitMs ?? DEFAULT_MAX_WAIT_MS);
    }
  }

  /** Scrapes the page and emits only if the context actually changed. */
  private scrape(): void {
    this.clearTimers();
    if (!this.tracking) {
      return;
    }
    // Re-enter the zone for the emission so subscribers' views update normally.
    this.zone.run(() => {
      const snapshot = this.contextEngine.getSnapshot(this.trackingOptions.snapshot);
      if (!contextEquals(snapshot, this.latest)) {
        this.latest = snapshot;
        this.contextSubject.next(snapshot);
      }
    });
  }

  private clearTimers(): void {
    if (this.quietTimer !== null) {
      clearTimeout(this.quietTimer);
      this.quietTimer = null;
    }
    if (this.maxWaitTimer !== null) {
      clearTimeout(this.maxWaitTimer);
      this.maxWaitTimer = null;
    }
  }
}

/** Whether a mutated node lives inside a region the engine is told not to look at. */
function isInsideIgnoredRegion(node: Node): boolean {
  const element = node instanceof Element ? node : node.parentElement;
  return !!element?.closest(IGNORE_SELECTOR);
}

/**
 * Compares two snapshots for meaningful equality, ignoring the capture timestamp. A
 * snapshot that cannot be serialised — a provider handed over something circular —
 * counts as changed, so it is at least emitted rather than silently dropped.
 */
function contextEquals(a: ClrPageContext, b: ClrPageContext | null): boolean {
  if (!b) {
    return false;
  }
  try {
    return JSON.stringify({ ...a, collectedAt: undefined }) === JSON.stringify({ ...b, collectedAt: undefined });
  } catch {
    return false;
  }
}

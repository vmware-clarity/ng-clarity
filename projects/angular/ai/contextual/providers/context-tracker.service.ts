/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, ErrorHandler, inject, Inject, Injectable, NgZone, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CLR_CONTEXT_IGNORE_SELECTOR } from '@clr/angular/utils';
import { defer, EMPTY, Observable, ReplaySubject, Subject, Subscription } from 'rxjs';

import { ClrContextRegistryService } from './context-registry.service';
import { ClrContextEngineService } from './contextual-engine.service';
import { ClrContextChange, clrDiffContext } from '../diff';
import { ClrContextSnapshotOptions, ClrPageContext } from '../interfaces/context.interface';

/** How the tracker paces its snapshots and what each one collects; see `start`. */
export interface ClrContextTrackingOptions {
  /** Budgets applied to every snapshot the tracker takes. */
  snapshot?: ClrContextSnapshotOptions;
  /** Milliseconds of quiet after the last DOM change before the page is scraped. Default `300`. */
  debounceMs?: number;
  /** Maximum delay between the first unprocessed change and the scrape. Default `2000`. */
  maxWaitMs?: number;
}

const DEFAULT_DEBOUNCE_MS = 300;
const DEFAULT_MAX_WAIT_MS = 2000;

/** Streams the page context, re-scraping after DOM, value and annotation changes. */
@Injectable({ providedIn: 'root' })
export class ClrContextTrackerService implements OnDestroy {
  /** Emits the latest page context, replaying the most recent one to new subscribers. */
  readonly context$: Observable<ClrPageContext>;
  /** What changed with each {@link context$} emission. Not replayed: subscribe before `start()` or `track()`. */
  readonly changes$: Observable<ClrContextChange>;

  private readonly errorHandler = inject(ErrorHandler);
  private readonly contextSubject = new ReplaySubject<ClrPageContext>(1);
  private readonly changesSubject = new Subject<ClrContextChange>();
  private trackingOptions: ClrContextTrackingOptions = {};
  private tracking = false;
  private observer: MutationObserver | null = null;
  private quietTimer: ReturnType<typeof setTimeout> | null = null;
  private maxWaitTimer: ReturnType<typeof setTimeout> | null = null;
  private stopListeningForValues: (() => void) | null = null;
  private readonly frames = new Map<HTMLIFrameElement, TrackedFrame>();
  private registrySubscription: Subscription | null = null;
  private latest: ClrPageContext | null = null;
  private latestSerialized: string | null = null;
  private destroyed = false;
  private sharedUsers = 0;
  private sharedStarted = false;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: unknown,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly contextEngine: ClrContextEngineService,
    private readonly contextRegistry: ClrContextRegistryService,
    private readonly zone: NgZone
  ) {
    // A completed ReplaySubject still replays: once destroyed, a new subscriber gets nothing.
    this.context$ = defer(() => (this.destroyed ? EMPTY : this.contextSubject.asObservable()));
    this.changes$ = this.changesSubject.asObservable();
  }

  /** The latest snapshot, or `null` before tracking starts. */
  get currentContext(): ClrPageContext | null {
    return this.latest;
  }

  /** Whether the tracker is watching the page. */
  get isTracking(): boolean {
    return this.tracking;
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.stop();
    // The last snapshot describes the whole page and should not outlive the injector.
    this.latest = null;
    this.latestSerialized = null;
    this.contextSubject.complete();
    this.changesSubject.complete();
  }

  /** Starts tracking with an immediate snapshot. Calling it again restarts with the new options. */
  start(options: ClrContextTrackingOptions = {}): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.stop();
    this.tracking = true;
    this.trackingOptions = options;
    this.latest = null;
    this.latestSerialized = null;
    // Outside the zone: zone.js patches MutationObserver and would run change detection on every batch.
    this.zone.runOutsideAngular(() => {
      this.observer = this.observeDocument(this.document);
      this.observeFrames();

      this.stopListeningForValues = listenForValues(this.document.body, event => this.onValueChange(event));

      this.registrySubscription = this.contextRegistry.changes$.subscribe(() => this.scheduleScrape());
    });
    this.refresh();
  }

  /**
   * The page context, tracked while anyone subscribes; the last subscriber to leave stops tracking.
   * Options apply to every consumer, since there is one tracker.
   */
  track(options?: ClrContextTrackingOptions): Observable<ClrPageContext> {
    return new Observable<ClrPageContext>(subscriber => {
      if (this.sharedUsers++ === 0) {
        this.sharedStarted = !this.tracking;
      }
      if (options || !this.tracking) {
        try {
          this.start(options);
        } catch (error) {
          this.errorHandler.handleError(error);
        }
      }
      const subscription = this.context$.subscribe(subscriber);
      return () => {
        subscription.unsubscribe();
        if (--this.sharedUsers === 0 && this.sharedStarted) {
          this.sharedStarted = false;
          this.stop();
        }
      };
    });
  }

  /** Stops tracking and disconnects the observers. */
  stop(): void {
    this.tracking = false;
    this.observer?.disconnect();
    this.observer = null;
    this.stopListeningForValues?.();
    this.stopListeningForValues = null;
    for (const [frame, tracked] of this.frames) {
      this.detachFrame(frame, tracked);
    }
    this.frames.clear();
    this.registrySubscription?.unsubscribe();
    this.registrySubscription = null;
    this.clearTimers();
  }

  /** Takes a new snapshot now instead of waiting for a change. */
  refresh(): void {
    this.emit(this.contextEngine.getSnapshot(this.trackingOptions.snapshot));
  }

  private emit(snapshot: ClrPageContext, serialized: string | null = serialize(snapshot)): void {
    const previous = this.latest;
    this.latest = snapshot;
    this.latestSerialized = serialized;
    this.contextSubject.next(snapshot);
    if (this.changesSubject.observed) {
      this.changesSubject.next(clrDiffContext(previous, snapshot));
    }
  }

  private onMutations(records: MutationRecord[]): void {
    if (records.every(record => isInsideIgnoredRegion(record.target) || isPlacementOnly(record))) {
      return;
    }
    this.scheduleScrape();
  }

  private onValueChange(event: Event): void {
    const target = event.target as Node | null;
    if (target && isInsideIgnoredRegion(target)) {
      return;
    }
    this.scheduleScrape();
  }

  private scheduleScrape(): void {
    if (!this.tracking) {
      return;
    }
    if (this.quietTimer !== null) {
      clearTimeout(this.quietTimer);
    }
    // An annotation change arrives inside the zone; scraping there would rerun change detection app-wide.
    this.zone.runOutsideAngular(() => {
      this.quietTimer = setTimeout(() => this.scrape(), this.trackingOptions.debounceMs ?? DEFAULT_DEBOUNCE_MS);
      if (this.maxWaitTimer === null) {
        this.maxWaitTimer = setTimeout(() => this.scrape(), this.trackingOptions.maxWaitMs ?? DEFAULT_MAX_WAIT_MS);
      }
    });
  }

  private scrape(): void {
    this.clearTimers();
    if (!this.tracking) {
      return;
    }
    try {
      const snapshot = this.contextEngine.getSnapshot(this.trackingOptions.snapshot);
      const serialized = serialize(snapshot);
      if (serialized === null || serialized !== this.latestSerialized) {
        this.zone.run(() => this.emit(snapshot, serialized));
      }
    } catch (error) {
      this.errorHandler.handleError(error);
    } finally {
      this.zone.runOutsideAngular(() => this.observeFrames());
    }
  }

  private observeDocument(target: Document): MutationObserver {
    const observer = new MutationObserver(records => this.onMutations(records));
    // The title lives in the head, so the whole document is observed.
    observer.observe(target.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true,
      characterData: true,
    });
    return observer;
  }

  /** Watches same-origin frames, nested ones too; an unreadable frame is watched for `load` instead. */
  private observeFrames(): void {
    if (!this.tracking) {
      return;
    }
    const present = new Set<HTMLIFrameElement>();
    for (const frame of allFrames(this.document)) {
      present.add(frame);
      const contents = readableDocument(frame);
      const tracked = this.frames.get(frame);
      if (tracked && tracked.document === contents) {
        continue;
      }
      if (tracked) {
        this.detachFrame(frame, tracked);
      }
      const onLoad = () => {
        this.observeFrames();
        this.scheduleScrape();
      };
      frame.addEventListener('load', onLoad);
      if (!contents) {
        this.frames.set(frame, { document: null, observer: null, stopListeningForValues: null, loadListener: onLoad });
        continue;
      }
      this.frames.set(frame, {
        document: contents,
        observer: this.observeDocument(contents),
        stopListeningForValues: listenForValues(contents.body, event => this.onValueChange(event)),
        loadListener: onLoad,
      });
    }
    for (const [frame, tracked] of this.frames) {
      if (!present.has(frame)) {
        this.detachFrame(frame, tracked);
        this.frames.delete(frame);
      }
    }
  }

  private detachFrame(frame: HTMLIFrameElement, tracked: TrackedFrame): void {
    frame.removeEventListener('load', tracked.loadListener);
    tracked.observer?.disconnect();
    tracked.stopListeningForValues?.();
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

interface TrackedFrame {
  document: Document | null;
  observer: MutationObserver | null;
  stopListeningForValues: (() => void) | null;
  loadListener: () => void;
}

/** Typing changes the `value` property, not the attribute, so a MutationObserver never sees it. */
function listenForValues(body: HTMLElement, listener: (event: Event) => void): () => void {
  body.addEventListener('input', listener, true);
  body.addEventListener('change', listener, true);
  return () => {
    body.removeEventListener('input', listener, true);
    body.removeEventListener('change', listener, true);
  };
}

function allFrames(root: Document): HTMLIFrameElement[] {
  const frames: HTMLIFrameElement[] = [];
  for (const frame of Array.from(root.querySelectorAll('iframe'))) {
    if (frame.closest(CLR_CONTEXT_IGNORE_SELECTOR)) {
      continue;
    }
    frames.push(frame);
    const contents = readableDocument(frame);
    if (contents) {
      frames.push(...allFrames(contents));
    }
  }
  return frames;
}

function readableDocument(frame: HTMLIFrameElement): Document | null {
  try {
    const contents = frame.contentDocument;
    return contents?.body ? contents : null;
  } catch {
    return null;
  }
}

function isInsideIgnoredRegion(node: Node): boolean {
  // A node in a frame is an instance of that window's Element, so `instanceof` would fail.
  const element = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  return !!element?.closest(CLR_CONTEXT_IGNORE_SELECTOR);
}

const VISIBILITY_DECLARATIONS = /(?:^|;)\s*(?:display|visibility|opacity|content-visibility)\s*:[^;]*/gi;

/** Whether a mutation only moved or resized something, e.g. a popover repositioning on scroll. */
function isPlacementOnly(record: MutationRecord): boolean {
  if (record.type !== 'attributes' || record.attributeName !== 'style') {
    return false;
  }
  const visibility = (style: string | null) =>
    (style?.match(VISIBILITY_DECLARATIONS) ?? [])
      .join(';')
      .replace(/[\s;]+/g, ' ')
      .trim();
  return visibility(record.oldValue) === visibility((record.target as Element).getAttribute('style'));
}

/** The snapshot as text without its timestamp, or `null` when it cannot be serialised. */
function serialize(snapshot: ClrPageContext): string | null {
  try {
    return JSON.stringify({ ...snapshot, collectedAt: undefined });
  } catch {
    return null;
  }
}

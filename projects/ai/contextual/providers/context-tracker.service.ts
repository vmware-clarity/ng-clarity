/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  AfterRenderRef,
  ApplicationRef,
  Inject,
  Injectable,
  Injector,
  OnDestroy,
  Optional,
  PLATFORM_ID,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ClrContextualEngineService } from './contextual-engine.service';
import { ClrContextSnapshotOptions, ClrPageContext } from '../interfaces/context.interface';

export interface ClrContextTrackingOptions {
  /** Budgets applied to every snapshot the tracker takes. */
  snapshot?: ClrContextSnapshotOptions;
  /**
   * After the first-paint scrape, take one more scrape when the application becomes
   * stable (pending tasks such as in-flight HTTP have finished) and emit it if the
   * page context changed — this is how data that arrives after navigation gets picked
   * up. Default `true`.
   */
  awaitStability?: boolean;
  /**
   * Upper bound on waiting for stability, in milliseconds. Applications that are never
   * stable (long-polling, recurring timers) get their follow-up scrape when this cap
   * elapses instead. Default `5000`.
   */
  stabilityTimeoutMs?: number;
}

const DEFAULT_STABILITY_TIMEOUT_MS = 5000;

/**
 * Maintains the current page context as a stream, timed by the framework's own
 * rendering lifecycle rather than by guessing:
 *
 * - On every completed router navigation, the page is scraped in an `afterNextRender`
 *   callback — after the change detection cycle that actually painted the newly
 *   activated route, however long that took. This works in zone-based and zoneless
 *   applications alike.
 * - Because data often arrives after the first paint, a follow-up scrape runs when
 *   `ApplicationRef.whenStable()` resolves (capped by `stabilityTimeoutMs`) and is
 *   emitted only if the context actually changed.
 *
 * Consumers such as an AI chat panel subscribe to {@link context$} and always hold
 * context describing the page the user is currently on, without polling.
 *
 * Every emission is a freshly computed snapshot of the live DOM at that moment — the
 * tracker stores only the latest emission and never merges or accumulates, so context
 * from a page that was navigated away from can never leak into the current one.
 * In-page changes between navigations (a modal opening, rows selected) do not emit on
 * their own; call {@link refresh} for an on-demand update, or use
 * `ClrContextualEngineService.getSnapshot()` when exactness at read time matters.
 */
@Injectable({ providedIn: 'root' })
export class ClrContextTrackerService implements OnDestroy {
  /** Emits the latest page context; replays the most recent snapshot to new subscribers. */
  readonly context$: Observable<ClrPageContext>;

  private readonly contextSubject = new ReplaySubject<ClrPageContext>(1);
  private trackingOptions: ClrContextTrackingOptions = {};
  private tracking = false;
  private navigationSubscription: Subscription | null = null;
  private pendingRender: AfterRenderRef | null = null;
  private stabilityTimer: ReturnType<typeof setTimeout> | null = null;
  /** Invalidates scrapes scheduled for a page the user has already left. */
  private scrapeSequence = 0;
  private latest: ClrPageContext | null = null;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: unknown,
    private readonly contextEngine: ClrContextualEngineService,
    private readonly applicationRef: ApplicationRef,
    private readonly injector: Injector,
    @Optional() private readonly router: Router | null
  ) {
    this.context$ = this.contextSubject.asObservable();
  }

  /** The most recent snapshot the tracker has taken, or `null` before tracking starts. */
  get currentContext(): ClrPageContext | null {
    return this.latest;
  }

  ngOnDestroy(): void {
    this.stop();
  }

  /**
   * Starts tracking: takes an initial snapshot immediately and re-scrapes the page
   * after every completed navigation. Calling it again restarts with the new options.
   */
  start(options: ClrContextTrackingOptions = {}): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.stop();
    this.tracking = true;
    this.trackingOptions = options;
    this.refresh();
    this.scheduleStabilityScrape(++this.scrapeSequence);
    if (this.router) {
      this.navigationSubscription = this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => this.onNavigationEnd());
    }
  }

  /** Stops tracking. The last emitted context stays available to subscribers. */
  stop(): void {
    this.tracking = false;
    this.scrapeSequence++;
    this.navigationSubscription?.unsubscribe();
    this.navigationSubscription = null;
    this.pendingRender?.destroy();
    this.pendingRender = null;
    if (this.stabilityTimer !== null) {
      clearTimeout(this.stabilityTimer);
      this.stabilityTimer = null;
    }
  }

  /** Takes a fresh snapshot immediately and emits it. */
  refresh(): void {
    this.latest = this.contextEngine.getSnapshot(this.trackingOptions.snapshot);
    this.contextSubject.next(this.latest);
  }

  private onNavigationEnd(): void {
    const sequence = ++this.scrapeSequence;
    // First paint: runs after the change detection cycle that rendered the newly
    // activated route, regardless of how long that render took.
    this.pendingRender?.destroy();
    this.pendingRender = afterNextRender(
      {
        read: () => {
          this.pendingRender = null;
          if (this.tracking && sequence === this.scrapeSequence) {
            this.refresh();
          }
        },
      },
      { injector: this.injector }
    );
    this.scheduleStabilityScrape(sequence);
  }

  /**
   * Once the application settles (or the cap elapses), scrape again and emit only if
   * the page context actually changed since the last emission.
   */
  private scheduleStabilityScrape(sequence: number): void {
    if (this.trackingOptions.awaitStability === false) {
      return;
    }
    if (this.stabilityTimer !== null) {
      clearTimeout(this.stabilityTimer);
      this.stabilityTimer = null;
    }
    const cap = new Promise<void>(resolve => {
      this.stabilityTimer = setTimeout(
        resolve,
        this.trackingOptions.stabilityTimeoutMs ?? DEFAULT_STABILITY_TIMEOUT_MS
      );
    });
    Promise.race([this.applicationRef.whenStable(), cap]).then(() => {
      if (this.stabilityTimer !== null) {
        clearTimeout(this.stabilityTimer);
        this.stabilityTimer = null;
      }
      if (!this.tracking || sequence !== this.scrapeSequence) {
        return;
      }
      const snapshot = this.contextEngine.getSnapshot(this.trackingOptions.snapshot);
      if (!contextEquals(snapshot, this.latest)) {
        this.latest = snapshot;
        this.contextSubject.next(snapshot);
      }
    });
  }
}

/** Compares two snapshots for meaningful equality, ignoring the capture timestamp. */
function contextEquals(a: ClrPageContext, b: ClrPageContext | null): boolean {
  if (!b) {
    return false;
  }
  return JSON.stringify({ ...a, collectedAt: undefined }) === JSON.stringify({ ...b, collectedAt: undefined });
}

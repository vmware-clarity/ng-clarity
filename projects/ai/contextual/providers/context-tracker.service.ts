/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, NgZone, OnDestroy, Optional, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ClrContextualEngineService } from './contextual-engine.service';
import { ClrContextSnapshotOptions, ClrPageContext } from '../interfaces/context.interface';

export interface ClrContextTrackingOptions {
  /**
   * How long to let the new page render after a navigation before it is scraped, in
   * milliseconds. Navigations resolve before the destination components have painted
   * (and often before their data has arrived), so scraping is deferred. Default `100`.
   */
  settleMs?: number;
  /** Budgets applied to every snapshot the tracker takes. */
  snapshot?: ClrContextSnapshotOptions;
}

const DEFAULT_SETTLE_MS = 100;

/**
 * Maintains the current page context as a stream: it takes a snapshot when tracking
 * starts and again after every completed router navigation, once the new page has had a
 * moment to render. Consumers such as an AI chat panel subscribe to {@link context$}
 * and always hold context describing the page the user is currently on, without
 * polling.
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
  private navigationSubscription: Subscription | null = null;
  private pendingScrape: ReturnType<typeof setTimeout> | null = null;
  private latest: ClrPageContext | null = null;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: unknown,
    private readonly contextEngine: ClrContextualEngineService,
    private readonly zone: NgZone,
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
    this.trackingOptions = options;
    this.refresh();
    if (this.router) {
      this.navigationSubscription = this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => this.scheduleScrape());
    }
  }

  /** Stops tracking. The last emitted context stays available to subscribers. */
  stop(): void {
    this.navigationSubscription?.unsubscribe();
    this.navigationSubscription = null;
    if (this.pendingScrape !== null) {
      clearTimeout(this.pendingScrape);
      this.pendingScrape = null;
    }
  }

  /** Takes a fresh snapshot immediately and emits it. */
  refresh(): void {
    this.latest = this.contextEngine.getSnapshot(this.trackingOptions.snapshot);
    this.contextSubject.next(this.latest);
  }

  private scheduleScrape(): void {
    if (this.pendingScrape !== null) {
      clearTimeout(this.pendingScrape);
    }
    // The timer runs outside Angular so it does not trigger extra change detection;
    // the emission re-enters the zone so subscribers' views update normally.
    this.zone.runOutsideAngular(() => {
      this.pendingScrape = setTimeout(() => {
        this.pendingScrape = null;
        this.zone.run(() => this.refresh());
      }, this.trackingOptions.settleMs ?? DEFAULT_SETTLE_MS);
    });
  }
}

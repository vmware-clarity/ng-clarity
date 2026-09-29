/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { inject, Injectable } from '@angular/core';
import { ClrContextTrackerService, ClrContextTrackingOptions } from '@clr/angular/ai';

/**
 * The demo's one context tracker, shared by the app-shell inspector and the contextual
 * pages. Each asks for tracking while it needs it and lets go when it no longer does; the
 * tracker stops only when nobody needs it, so closing the inspector never stops a page's
 * tracking, nor leaving a page the inspector's.
 */
@Injectable({ providedIn: 'root' })
export class SharedContextTracking {
  private readonly tracker = inject(ClrContextTrackerService);
  private users = 0;

  /**
   * Starts tracking for one more user. With `options` the tracker is (re)started with
   * them, so a page's own options apply while it is shown; without, tracking already
   * running is left as it is.
   */
  acquire(options?: ClrContextTrackingOptions): void {
    this.users++;
    if (options || !this.tracker.isTracking) {
      this.tracker.start(options);
    }
  }

  /** Lets go of tracking; the tracker stops once nobody holds it. */
  release(): void {
    this.users = Math.max(0, this.users - 1);
    if (this.users === 0) {
      this.tracker.stop();
    }
  }
}

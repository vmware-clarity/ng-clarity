/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, inject, OnDestroy } from '@angular/core';
import { ClrContextTrackerService, ClrPageContext } from '@clr/angular/ai';
import { Subscription } from 'rxjs';

import { SharedContextTracking } from './shared-tracking';

/**
 * Global "what does the AI context engine see right now" panel, mounted once in the app
 * shell (see AppComponent) rather than on any single demo page. `ClrContextTrackerService`
 * watches the live DOM directly, not Angular routes, so this works unmodified on every one
 * of the ~60 existing component demo pages — no per-component wiring, no example catalog.
 */
@Component({
  selector: 'app-context-inspector',
  templateUrl: './context-inspector.component.html',
  styleUrls: ['./context-inspector.component.scss'],
  standalone: false,
})
export class ContextInspectorComponent implements OnDestroy {
  open = false;
  snapshotJson = '';
  snapshotBytes = 0;
  snapshotCount = 0;

  private subscription?: Subscription;
  private tracking = false;
  private readonly sharedTracking = inject(SharedContextTracking);

  constructor(private contextTracker: ClrContextTrackerService) {}

  toggle(): void {
    this.setOpen(!this.open);
  }

  /**
   * Single path for every way the panel's open state can change — the header trigger
   * button, and the panel's own close button / ESC / backdrop via `clrSidePanelOpenChange`.
   */
  setOpen(open: boolean): void {
    this.open = open;
    this.subscription?.unsubscribe();
    if (open && !this.tracking) {
      // The tracker is shared with the demo pages: the panel keeps whatever options a page
      // is tracking with, and only starts tracking when nobody is.
      this.sharedTracking.acquire();
      this.tracking = true;
    } else if (!open && this.tracking) {
      // Nothing here consumes the context while the panel is closed; tracking stops once
      // no page needs it either.
      this.sharedTracking.release();
      this.tracking = false;
    }
    if (open) {
      this.subscription = this.contextTracker.context$.subscribe(snapshot => this.render(snapshot));
    }
  }

  refresh(): void {
    this.contextTracker.refresh();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    if (this.tracking) {
      this.sharedTracking.release();
    }
  }

  private render(snapshot: ClrPageContext): void {
    this.snapshotCount++;
    this.snapshotJson = JSON.stringify(snapshot, null, 2);
    this.snapshotBytes = JSON.stringify(snapshot).length;
  }
}

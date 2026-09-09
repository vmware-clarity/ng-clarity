/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnDestroy } from '@angular/core';
import { ClrContextTrackerService, ClrContextualEngineService, ClrPageContext } from '@clr/angular/ai';
import { Subscription } from 'rxjs';

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

  constructor(
    private contextEngine: ClrContextualEngineService,
    private contextTracker: ClrContextTrackerService
  ) {}

  toggle(): void {
    this.setOpen(!this.open);
  }

  /**
   * Single path for every way the panel's open state can change — the header trigger
   * button, and the panel's own close button / ESC / backdrop via `clrSidePanelOpenChange`.
   */
  setOpen(open: boolean): void {
    this.open = open;
    if (open) {
      // start() is idempotent and cheap to call again: it always leaves tracking in a
      // known-good state, so this is self-healing even if some other page's own
      // start()/stop() calls on this same singleton left it stopped while the panel
      // was closed.
      this.contextTracker.start();
      this.subscription = this.contextTracker.context$.subscribe(snapshot => this.render(snapshot));
    } else {
      // No DOM work happens for this panel while it isn't visible. Tracking itself is
      // deliberately left running for whichever page is current — closing the panel
      // only stops reacting to it.
      this.subscription?.unsubscribe();
    }
  }

  refresh(): void {
    this.contextTracker.refresh();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private render(snapshot: ClrPageContext): void {
    this.snapshotCount++;
    this.snapshotJson = JSON.stringify(snapshot, null, 2);
    this.snapshotBytes = JSON.stringify(snapshot).length;
  }
}

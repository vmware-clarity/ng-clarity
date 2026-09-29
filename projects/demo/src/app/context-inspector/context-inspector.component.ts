/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnDestroy } from '@angular/core';
import { ClrContextTrackerService, ClrPageContext } from '@clr/angular/ai';
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
    this.subscription = undefined;
    // The tracker is shared with the demo pages: the panel joins whatever tracking a page
    // runs with its own options, and tracking stops once neither needs it.
    if (open) {
      this.subscription = this.contextTracker.track().subscribe(snapshot => this.render(snapshot));
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

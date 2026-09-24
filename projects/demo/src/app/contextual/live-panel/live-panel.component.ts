/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { ClrContextPreset, clrContextPreset, ClrContextTrackerService } from '@clr/angular/ai';
import { Subscription } from 'rxjs';

/**
 * The live snapshot of the page, updating as the page changes. The tracker watches the
 * DOM and emits whenever the page context changes; this panel is marked
 * `data-clr-context-ignore`, so its own re-renders neither re-trigger tracking nor
 * appear in the context.
 */
@Component({
  selector: 'clr-context-live-panel',
  standalone: true,
  imports: [FormsModule, ClarityModule],
  templateUrl: './live-panel.component.html',
  styleUrls: ['./live-panel.component.scss'],
})
export class ContextLivePanelComponent implements OnInit, OnDestroy {
  /**
   * The demo pages are deliberately busy — nav, a datagrid, a long form, plugin frames —
   * so they need more than the default budget; the panel says so when it still runs out.
   */
  @Input() maxComponents = 500;

  snapshotJson = '';
  snapshotBytes = 0;
  snapshotCount = 0;
  snapshotTruncated = false;
  snapshotFocus: string | null = null;
  profile: ClrContextPreset = 'full';

  private trackingSubscription: Subscription | null = null;

  constructor(private readonly contextTracker: ClrContextTrackerService) {}

  ngOnInit(): void {
    this.trackingSubscription = this.contextTracker.context$.subscribe(snapshot => {
      this.snapshotCount++;
      this.snapshotTruncated = snapshot.truncated === true;
      this.snapshotFocus = snapshot.focus ?? null;
      this.snapshotBytes = JSON.stringify(snapshot).length;
      this.snapshotJson = JSON.stringify(snapshot, null, 2);
    });
    this.setProfile(this.profile);
  }

  ngOnDestroy(): void {
    // The tracker is a singleton the app-shell inspector shares; only this panel's use of it ends here.
    this.trackingSubscription?.unsubscribe();
  }

  /** Restarts tracking with a preset, so the same page can be compared under each. */
  setProfile(profile: ClrContextPreset): void {
    this.profile = profile;
    this.contextTracker.start({ snapshot: clrContextPreset(profile, { maxComponents: this.maxComponents }) });
  }

  refreshNow(): void {
    this.contextTracker.refresh();
  }
}

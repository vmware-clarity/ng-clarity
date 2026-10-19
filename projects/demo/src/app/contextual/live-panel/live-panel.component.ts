/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import {
  ClrContextPreset,
  clrContextPreset,
  ClrContextTrackerService,
  ClrContextTrackingOptions,
} from '@clr/angular/ai';
import { Subscription } from 'rxjs';

/** The live page snapshot; `data-clr-context-ignore` keeps it out of tracking and the context. */
@Component({
  selector: 'clr-context-live-panel',
  standalone: true,
  imports: [FormsModule, ClarityModule],
  templateUrl: './live-panel.component.html',
  styleUrls: ['./live-panel.component.scss'],
})
export class ContextLivePanelComponent implements OnInit, OnDestroy {
  /** The demo pages are busy, so they need more than the default budget. */
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
    this.trackingSubscription = this.contextTracker.track(this.trackingOptions()).subscribe(snapshot => {
      this.snapshotCount++;
      this.snapshotTruncated = snapshot.truncated === true;
      this.snapshotFocus = snapshot.focus ?? null;
      this.snapshotBytes = JSON.stringify(snapshot).length;
      this.snapshotJson = JSON.stringify(snapshot, null, 2);
    });
  }

  ngOnDestroy(): void {
    this.trackingSubscription?.unsubscribe();
  }

  setProfile(profile: ClrContextPreset): void {
    this.profile = profile;
    this.contextTracker.start(this.trackingOptions());
  }

  refreshNow(): void {
    this.contextTracker.refresh();
  }

  private trackingOptions(): ClrContextTrackingOptions {
    return { snapshot: clrContextPreset(this.profile, { maxComponents: this.maxComponents }) };
  }
}

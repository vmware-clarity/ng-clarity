/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { CLR_CONTEXT_PRESETS, ClrContextPreset, ClrContextService, ClrPageContext } from '@clr/angular/ai';

/** A snapshot of the page, read again on Refresh; `data-clr-context-ignore` keeps it out of the context. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'clr-context-live-panel',
  standalone: true,
  imports: [FormsModule, ClarityModule],
  templateUrl: './live-panel.component.html',
  styleUrls: ['./live-panel.component.scss'],
})
export class ContextLivePanelComponent implements OnInit {
  /** The demo pages are busy, so they need more than the default budget. */
  @Input() maxComponents = 500;

  snapshotJson = '';
  snapshotBytes = 0;
  snapshotCount = 0;
  snapshotTruncated = false;
  snapshotFocus: string | null = null;
  profile: ClrContextPreset = 'full';

  constructor(private readonly context: ClrContextService) {}

  ngOnInit(): void {
    this.refreshNow();
  }

  setProfile(profile: ClrContextPreset): void {
    this.profile = profile;
    this.refreshNow();
  }

  async refreshNow(): Promise<void> {
    this.render(await this.context.snapshot(this.options()));
  }

  private render(snapshot: ClrPageContext): void {
    this.snapshotCount++;
    this.snapshotTruncated = snapshot.truncated === true;
    this.snapshotFocus = snapshot.focus ?? null;
    this.snapshotBytes = JSON.stringify(snapshot).length;
    this.snapshotJson = JSON.stringify(snapshot, null, 2);
  }

  private options() {
    return { ...CLR_CONTEXT_PRESETS[this.profile], maxComponents: this.maxComponents };
  }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ClrContextTrackerService, ClrPageContext } from '@clr/angular/ai';
import { Subscription } from 'rxjs';

/** App-shell panel showing what the context engine sees, on every demo page. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
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

  setOpen(open: boolean): void {
    this.open = open;
    this.subscription?.unsubscribe();
    this.subscription = undefined;
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

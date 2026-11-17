/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CLR_CONTEXT_STATE_ATTRIBUTE } from '@clr/angular/ai';

import { ContextInventoryComponent } from '../inventory/inventory.component';
import { ContextLivePanelComponent } from '../live-panel/live-panel.component';

/** What this view is for; an app would usually put it on `<body>` in index.html. */
const VIEW_METADATA = {
  purpose: 'Review the hosts of a datacenter and add new ones',
  tasks: ['Find disconnected hosts', 'Put hosts into maintenance', 'Add a host'],
};

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'clr-contextual-live-demo',
  standalone: true,
  imports: [ContextInventoryComponent, ContextLivePanelComponent],
  templateUrl: './live.demo.html',
})
export class ContextualLiveDemo {
  constructor() {
    // On the view root (the body), the annotation describes the whole view: its state becomes the snapshot's `metadata`.
    const body = inject(DOCUMENT).body;
    body.setAttribute(CLR_CONTEXT_STATE_ATTRIBUTE, JSON.stringify(VIEW_METADATA));
    inject(DestroyRef).onDestroy(() => body.removeAttribute(CLR_CONTEXT_STATE_ATTRIBUTE));
  }
}

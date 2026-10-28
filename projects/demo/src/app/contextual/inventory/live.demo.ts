/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ContextInventoryComponent } from '../inventory/inventory.component';
import { ContextLivePanelComponent } from '../live-panel/live-panel.component';

@Component({
  selector: 'clr-contextual-live-demo',
  standalone: true,
  imports: [ContextInventoryComponent, ContextLivePanelComponent],
  templateUrl: './live.demo.html',
})
export class ContextualLiveDemo {}

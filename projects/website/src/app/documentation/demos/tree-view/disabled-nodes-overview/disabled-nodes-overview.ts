/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrIcon, ClrIconModule, ClrTreeViewModule } from '@clr/angular';

@Component({
  selector: 'app-disabled-nodes-overview-demo',
  styleUrl: '../tree-view.demo.scss',
  templateUrl: 'disabled-nodes-overview.html',
  imports: [ClrTreeViewModule, ClrIcon, ClrIconModule],
})
export class DisabledNodesOverviewDemo {}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrSidePanelModule } from '@clr/angular';

@Component({
  selector: 'clr-side-panel-static-backdrop-example',
  templateUrl: './static-backdrop.example.html',
  imports: [ClrSidePanelModule],
})
export class SidePanelStaticBackdropExample {
  opened = false;
}

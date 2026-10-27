/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrAlertModule } from '@clr/angular';

@Component({
  selector: 'clr-alert-close-event-example',
  templateUrl: './close-event.example.html',
  imports: [ClrAlertModule],
})
export class AlertCloseEventExample {
  closeMessage = '';

  onClose() {
    this.closeMessage = 'The alert has been closed';
  }
}

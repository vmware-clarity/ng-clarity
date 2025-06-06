/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-alert-close-event-demo-angular',
  styleUrls: ['../alert.demo.scss'],
  templateUrl: './alert-angular-close-event.demo.html',
})
export class AlertAngularCloseEventDemo {
  closeMessage = '';

  onClose(): void {
    this.closeMessage = 'The alert has been closed';
  }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-density-demo',
  templateUrl: 'layout-size.html',
  styles: [
    `
      .clr-row {
        padding: var(--cds-global-space-6);
        h3 {
          margin-bottom: var(--cds-global-space-7);
        }
      }
      .density-container {
        padding-bottom: var(--cds-global-space-5);
        border: 1px solid var(--cds-alias-object-border-color);
        background: var(--cds-alias-object-container-background-shade);
      }
    `,
  ],
})
export class LayoutSizeDemo {
  densities = [
    { name: 'Current', type: null },
    { name: 'Regular', type: 'regular' },
    { name: 'Compact', type: 'compact' },
  ];

  alerts = [
    { text: 'Message 1', type: 'info', isAppLevel: false },
    { text: 'Message 2', type: 'danger', isAppLevel: false },
    { text: 'Message 3', type: 'warning', isAppLevel: false },
    { text: 'Message 4', type: 'success', isAppLevel: false },
    { text: 'Message 5', type: 'neutral', isAppLevel: false },
  ];
}

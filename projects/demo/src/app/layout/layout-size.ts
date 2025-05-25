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
        height: 100%;
        padding: var(--cds-global-space-6);
        h3 {
          margin-bottom: var(--cds-global-space-7);
        }
      }
      div[class~='clr-col-3'] {
        height: 100%;
        border: 1px solid var(--cds-alias-object-border-color);
        background: var(--cds-alias-object-container-background-shade);
      }
    `,
  ],
})
export class LayoutSizeDemo {}

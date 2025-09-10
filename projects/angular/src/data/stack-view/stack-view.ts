/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-stack-view',
  template: `
    <ng-content select="clr-stack-header"></ng-content>
    <div class="stack-view"><ng-content></ng-content></div>
  `,
  // Custom elements are inline by default.
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  standalone: false,
})
export class ClrStackView {}

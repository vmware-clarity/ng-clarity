/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrStackView } from './stack-view';

@Component({
  selector: 'clr-stack-header',
  template: `
    <div class="stack-header">
      <h4 class="stack-title"><ng-content></ng-content></h4>

      <span class="stack-actions">
        <ng-content select=".stack-action"></ng-content>
      </span>
    </div>
  `,
  // Custom elements are inline by default
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  standalone: false,
})
export class ClrStackHeader {
  constructor(public stackView: ClrStackView) {}
}

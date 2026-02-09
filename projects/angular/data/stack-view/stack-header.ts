/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';

import { ClrStackView } from './stack-view';
import { HeadingLevel } from '../../utils/types/heading-level';

@Component({
  selector: 'clr-stack-header',
  template: `
    <div class="stack-header">
      <div
        [attr.role]="ariaLevel ? 'heading' : null"
        [attr.aria-level]="ariaLevel ? ariaLevel : null"
        class="stack-title"
      >
        <ng-content></ng-content>
      </div>

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
  /**
   * Depth of the stack view header starting from 1 for first level
   */
  @Input('clrStackHeaderLevel') ariaLevel: HeadingLevel;

  constructor(public stackView: ClrStackView) {}
}

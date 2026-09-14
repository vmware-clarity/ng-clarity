/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { angleIcon, ClarityIcons, ClrIcon } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const HTML_EXAMPLE = `
<div class="card card-collapsible" [class.card-collapsed]="collapsed">
  <div class="card-header">
    <button
      type="button"
      class="card-header-toggle"
      aria-controls="card-content"
      aria-describedby="card-header"
      [attr.aria-expanded]="!collapsed"
      [attr.aria-label]="collapsed ? 'Expand card' : 'Collapse card'"
      (click)="collapsed = !collapsed"
    >
      <cds-icon shape="angle" direction="right" class="card-header-icon"></cds-icon>
    </button>
    <span id="card-header">Header</span>
  </div>
  <div
    id="card-content"
    role="region"
    class="card-collapsible-content"
    aria-labelledby="card-header"
    [attr.aria-hidden]="collapsed"
    [attr.inert]="collapsed ? '' : null"
  >
    <div class="card-collapsible-inner">
      <div class="card-block">
        <h4 class="card-title">Title</h4>
        <p class="card-text">Click the chevron in the header to collapse or expand this card.</p>
      </div>
      <div class="card-footer">
        <button class="btn btn-sm btn-link">Action</button>
      </div>
    </div>
  </div>
</div>
`;

@Component({
  selector: 'clr-card-collapsible-demo',
  styleUrl: './card.demo.scss',
  templateUrl: './card-collapsible.html',
  imports: [ClrIcon, StackblitzExampleComponent],
})
export class CardCollapsibleDemo {
  htmlExample = HTML_EXAMPLE;
  collapsed = false;

  constructor() {
    ClarityIcons.addIcons(angleIcon);
  }
}

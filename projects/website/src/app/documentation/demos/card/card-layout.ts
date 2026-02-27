/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const HTML_EXAMPLE = `
<div class="clr-row">
  <div class="clr-col-lg-5 clr-col-md-8 clr-col-12">
    <div class="card">
      <div class="card-header">Header</div>
      <div class="card-block">
        <div class="card-title">Block</div>
        <div class="card-text">
          Card content can contain text, links, images, data visualizations, lists and more.
        </div>
      </div>
      <div class="card-footer">
        <button class="btn btn-sm btn-link">Footer Action 1</button>
        <button class="btn btn-sm btn-link">Footer Action 2</button>
      </div>
    </div>
  </div>
</div>
`;

@Component({
  selector: 'clr-card-layout-demo',
  styleUrl: './card.demo.scss',
  templateUrl: './card-layout.html',
  imports: [StackblitzExampleComponent],
})
export class CardLayoutDemo {
  htmlExample = HTML_EXAMPLE;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrAlertModule, ClrIcon, ClrIconModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';

const HTML_EXAMPLE = `
<div class="card">
  <div class="card-block">
    <div class="alert alert-warning alert-sm" role="alert">
      <div class="alert-items">
        <div class="alert-item static">
          <div class="alert-icon-wrapper">
            <clr-icon class="alert-icon" shape="warning-standard"></clr-icon>
          </div>
          <div class="alert-text">Use small alerts in a card.</div>
        </div>
      </div>
      <button type="button" class="close" aria-label="Close">
        <clr-icon aria-hidden="true" shape="times"></clr-icon>
      </button>
    </div>
    <div class="card-media-block wrap">
      <img
        class="card-media-image"
        src="/assets/images/documentation/cards/placeholder_60x60.png"
        alt="Example of Image in a Card"
      />
      <div class="card-media-description">
        <span class="card-media-title">Project B</span>
        <span class="card-media-text">Owner: Jane Doe</span>
      </div>
    </div>
    <p class="card-text">...</p>
  </div>
  <div class="card-footer">
    <a class="card-link">Button One</a>
    <a class="card-link">Button Two</a>
  </div>
</div>
`;

@Component({
  selector: 'clr-alert-demo-cards',
  styleUrl: '../alerts.demo.scss',
  templateUrl: './alert-cards.demo.html',
  imports: [ClrIcon, ClrIconModule, ClrAlertModule, StackblitzExampleComponent],
})
export class AlertCardsDemo {
  htmlExample = HTML_EXAMPLE;
}

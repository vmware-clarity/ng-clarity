/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const html = `
<div class="signpost-triggers-wrapper">
  <div class="signpost-trigger-demo">
    <div class="signpost-item">
      <h6>Clarity Icon</h6>
      <clr-signpost>
        <button class="btn btn-link btn-icon" aria-label="Icon Button Trigger" clrSignpostTrigger>
          <cds-icon shape="user" class="is-solid has-badge-info"></cds-icon>
        </button>
        <clr-signpost-content [clrPosition]="'bottom-middle'" *clrIfOpen>
          Lorem ipsum...
        </clr-signpost-content>
      </clr-signpost>
    </div>
    <div class="signpost-item">
      <h6>Button Link</h6>
      <div class="trigger-item">
        <clr-signpost>
          <button class="btn btn-link" clrSignpostTrigger>Button Link Trigger</button>
          <clr-signpost-content [clrPosition]="'top-middle'" *clrIfOpen>
            Lorem ipsum...
          </clr-signpost-content>
        </clr-signpost>
      </div>
    </div>
    <div class="signpost-item">
      <h6>Button Link w/ Clarity Icon</h6>
      <div class="trigger-item">
        <clr-signpost>
          <button class="btn btn-link" clrSignpostTrigger>
            Button Link
            <cds-icon shape="help-info"></cds-icon>
          </button>
          <clr-signpost-content [clrPosition]="'bottom-middle'" *clrIfOpen>
            Lorem ipsum...
          </clr-signpost-content>
        </clr-signpost>
      </div>
    </div>
  </div>
</div>
`;

@Component({
  selector: 'clr-signpost-triggers-demo',
  templateUrl: './signpost-triggers.demo.html',
  styleUrl: './signpost.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  standalone: false,
})
export class SignpostTriggersDemo {
  html = html;
}

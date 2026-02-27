/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrIcon, ClrIconModule, ClrModalModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const SMALL_EXAMPLE = `
<div class="modal">
  <div class="modal-dialog modal-sm" role="dialog" aria-hidden="true">
    <div class="modal-content">
      <div class="modal-header">
        <button aria-label="Close" class="close" type="button">
          <clr-icon shape="window-close"></clr-icon>
        </button>
        <div class="modal-title">Small modal</div>
      </div>
      <div class="modal-body">I am a small modal.</div>
      <div class="modal-footer">
        <button class="btn btn-primary" type="button">Ok</button>
      </div>
    </div>
  </div>
</div>
<div class="modal-backdrop" aria-hidden="true"></div>
`;

const LARGE_EXAMPLE = `
<div class="modal">
  <div class="modal-dialog modal-lg" role="dialog" aria-hidden="true">
    <div class="modal-content">
      <div class="modal-header">
        <button aria-label="Close" class="close" type="button">
          <clr-icon aria-hidden="true" shape="window-close"></clr-icon>
        </button>
        <div class="modal-title">Large modal</div>
      </div>
      <div class="modal-body">I am a large modal.</div>
      <div class="modal-footer">
        <button class="btn btn-outline" type="button">Cancel</button>
        <button class="btn btn-primary" type="button">Ok</button>
      </div>
    </div>
  </div>
</div>
<div class="modal-backdrop" aria-hidden="true"></div>
`;

const EXTRA_LARGE_EXAMPLE = `
<div class="modal">
  <div class="modal-dialog modal-xl" role="dialog" aria-hidden="true">
    <div class="modal-content">
      <div class="modal-header">
        <button aria-label="Close" class="close" type="button">
          <clr-icon aria-hidden="true" shape="window-close"></clr-icon>
        </button>
        <div class="modal-title">Extra large modal</div>
      </div>
      <div class="modal-body">I am an extra large modal.</div>
      <div class="modal-footer">
        <button class="btn btn-outline" type="button">Cancel</button>
        <button class="btn btn-primary" type="button">Ok</button>
      </div>
    </div>
  </div>
</div>
<div class="modal-backdrop" aria-hidden="true"></div>
`;

const FULL_SCREEN_EXAMPLE = `
<div class="modal modal-full-screen">
  <div class="modal-dialog modal-full-screen" role="dialog" aria-hidden="true">
    <div class="modal-content">
      <div class="modal-header">
        <button aria-label="Close" class="close" type="button">
          <clr-icon aria-hidden="true" shape="window-close"></clr-icon>
        </button>
        <div class="modal-title">Full-Screen modal</div>
      </div>
      <div class="modal-body">I am a full-screen modal.</div>
      <div class="modal-footer">
        <button class="btn btn-outline" type="button">Cancel</button>
        <button class="btn btn-primary" type="button">Ok</button>
      </div>
    </div>
  </div>
</div>
<div class="modal-backdrop" aria-hidden="true"></div>
`;

@Component({
  selector: 'clr-modal-sizes-demo',
  templateUrl: './modal-sizes.demo.html',
  imports: [ClrIcon, ClrIconModule, ClrModalModule, StackblitzExampleComponent],
})
export class ModalSizesDemo {
  smallExample = SMALL_EXAMPLE;
  largeExample = LARGE_EXAMPLE;
  extraLargeExample = EXTRA_LARGE_EXAMPLE;
  fullScreenExample = FULL_SCREEN_EXAMPLE;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ClrIcon, ClrIconModule, ClrModalModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<div class="modal">
  <div class="modal-dialog fadeDown" [class.in]="animatedExampleIn" role="dialog" aria-hidden="true">
    <div class="modal-content">
      <div class="modal-header">
        <button aria-label="Close" class="close" type="button">
          <clr-icon shape="window-close"></clr-icon>
        </button>
        <div class="modal-title">I have a nice title</div>
      </div>
      <div class="modal-body">But not much to say...</div>
      <div class="modal-footer">
        <button class="btn btn-outline" type="button">Cancel</button>
        <button class="btn btn-primary" type="button">Ok</button>
      </div>
    </div>
  </div>
</div>

<div class="modal-backdrop fade static" [class.in]="animatedExampleIn" aria-hidden="true"></div>
`;

const EXAMLPE_TS = `
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, ClrModalModule],
})
export class ExampleComponent implements OnInit, OnDestroy {
  animatedExampleIn = false;
  private interval: any;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.interval = setInterval(() => (this.animatedExampleIn = !this.animatedExampleIn), 2000);
    }
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
`;

@Component({
  selector: 'clr-modal-animation-demo',
  templateUrl: './modal-animation.demo.html',
  imports: [ClrIcon, ClrIconModule, ClrModalModule, StackblitzExampleComponent],
})
export class ModalAnimationDemo implements OnInit, OnDestroy {
  animatedExampleIn = false;

  example = EXAMPLE;
  exampleTs = EXAMLPE_TS;

  private interval: any;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // If you want interactivity, go to the Angular component demo.
      this.interval = setInterval(() => (this.animatedExampleIn = !this.animatedExampleIn), 2000);
    }
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

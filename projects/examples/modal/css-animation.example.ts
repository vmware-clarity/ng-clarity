/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ClrIcon, ClrModalModule } from '@clr/angular';

@Component({
  selector: 'clr-modal-css-animation-example',
  templateUrl: './css-animation.example.html',
  styleUrl: './css-animation.example.scss',
  imports: [ClrIcon, ClrModalModule],
})
export class ModalCssAnimationExample implements OnInit, OnDestroy {
  animatedExampleIn = false;

  private readonly platformId = inject(PLATFORM_ID);
  private interval: ReturnType<typeof setInterval> | undefined;

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

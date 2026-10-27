/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnDestroy, viewChild } from '@angular/core';
import { ClrSpinnerModule, ClrStackBlock, ClrStackViewModule } from '@clr/angular';

interface StackViewItem {
  title: string;
  content: string;
  children?: StackViewItem[];
}

@Component({
  selector: 'clr-stack-view-lazyload-example',
  templateUrl: './lazyload.example.html',
  imports: [ClrSpinnerModule, ClrStackViewModule],
})
export class StackViewLazyloadExample implements OnDestroy {
  readonly lazyBlock = viewChild<ClrStackBlock>('lazyBlock');

  children: StackViewItem[] = [];

  private fetchTimeout: ReturnType<typeof setTimeout> | undefined;

  fetchChildren(): void {
    if (this.children.length > 0 || this.fetchTimeout) {
      return;
    }

    // Simulates loading the children from a server.
    this.fetchTimeout = setTimeout(() => {
      this.fetchTimeout = undefined;
      this.children = [
        { title: 'Sub-label 1', content: 'Sub-content 1' },
        { title: 'Sub-label 2', content: 'Sub-content 2' },
        { title: 'Sub-label 3', content: 'Sub-content 3' },
      ];
    }, 2000);
  }

  resetChildren(): void {
    clearTimeout(this.fetchTimeout);
    this.fetchTimeout = undefined;

    const lazyBlock = this.lazyBlock();
    if (lazyBlock) {
      lazyBlock.expanded = false;
    }

    this.children = [];
  }

  ngOnDestroy(): void {
    clearTimeout(this.fetchTimeout);
  }
}

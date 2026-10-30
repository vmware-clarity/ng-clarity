/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';

@Component({
  selector: 'clr-loading-button-group-demo',
  templateUrl: './loading-button-group.html',
  styleUrls: ['../../button-group.demo.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LoadingButtonGroupDemo {
  load = false;
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  startLoading(): void {
    this.load = true;
    setTimeout(() => {
      this.changeDetectorRef.markForCheck();
      this.load = false;
    }, 2000);
  }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-progress-bar-static-example',
  templateUrl: './static.example.html',
})
export class ProgressBarStaticExample {
  staticProgbarValue = 16;
  staticDangerValue = 8;
  staticSuccessValue = 80;
  staticLabeledProgbarValue = 87;

  setNewValues(): void {
    this.staticProgbarValue = this.getNewValue();
    this.staticLabeledProgbarValue = this.getNewValue();
    this.staticDangerValue = this.getNewValue();
    this.staticSuccessValue = this.getNewValue();
  }

  private getNewValue(): number {
    return Math.floor(Math.random() * 98) + 1;
  }
}

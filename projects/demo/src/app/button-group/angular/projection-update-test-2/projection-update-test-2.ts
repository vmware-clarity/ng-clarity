/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-button-group-projection-update-test-2-demo',
  templateUrl: './projection-update-test-2.html',
  styleUrls: ['../../button-group.demo.scss'],
  standalone: false,
})
export class ProjectionUpdateTest2Demo {
  show = true;

  toggleShow(): void {
    this.show = !this.show;
  }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  templateUrl: './layout-modal.html',
  standalone: false,
})
export class FormsLayoutModalDemo {
  layout = 'vertical';
  grid = false;
  vertical = false;
  horizontal = false;
  compact = false;
  verticalGrid = false;
  horizontalGrid = false;
  compactGrid = false;
}

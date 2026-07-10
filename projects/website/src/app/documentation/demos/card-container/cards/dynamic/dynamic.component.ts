/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'appfx-demo-dynamic-card',
  standalone: true,
  template: `
    <div class="card">
      <div class="card-header">Dynamic</div>
      <div class="card-block">Dynamic</div>
    </div>
  `,
})
export class DynamicCardComponent {}

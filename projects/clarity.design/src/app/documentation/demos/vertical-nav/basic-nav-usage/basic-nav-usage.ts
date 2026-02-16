/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'clr-basic-vertical-nav-usage-demo',
  templateUrl: './basic-nav-usage.html',
  styleUrl: '../vertical-nav.demo.scss',
  standalone: false,
})
export class BasicNavUsage {
  @Input() demoToggleDont = false;
}

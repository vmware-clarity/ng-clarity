/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ClarityIcons, ClrIcon, successStandardIcon, timesCircleIcon } from '@clr/angular';

@Component({
  selector: 'app-use-dont-use',
  templateUrl: './use-dont-use.component.html',
  styleUrl: './use-dont-use.component.scss',
  imports: [CommonModule, ClrIcon],
})
export class UseDontUseComponent {
  readonly type = input<'use' | 'dont_use'>('use');
  readonly heading = input('');

  constructor() {
    ClarityIcons.addIcons(timesCircleIcon, successStandardIcon);
  }
}

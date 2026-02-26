/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { checkIcon, ClarityIcons, ClrIcon, timesIcon, warningStandardIcon } from '@clr/angular';

const TYPE_DISPLAY_TEXT = {
  do: 'Do',
  dont: "Don't",
  warn: 'Not typically recommended',
};

@Component({
  selector: 'app-do-dont',
  templateUrl: 'do-dont.component.html',
  styleUrl: './do-dont.component.scss',
  imports: [CommonModule, ClrIcon],
})
export class DoDontComponent {
  readonly type = input<'do' | 'dont' | 'warn'>('do');
  readonly isCard = input(false);
  readonly caption = input('');

  // optional
  @Input() heading: string | undefined;
  @Input() headingLevel: number | undefined;

  typeDisplayText = TYPE_DISPLAY_TEXT;

  constructor() {
    ClarityIcons.addIcons(checkIcon, timesIcon, warningStandardIcon);
  }
}

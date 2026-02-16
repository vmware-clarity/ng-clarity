/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { checkIcon, ClarityIcons, timesIcon, warningStandardIcon } from '@cds/core/icon';
import { ClrIconModule } from '@clr/angular';

const TYPE_DISPLAY_TEXT = {
  do: 'Do',
  dont: "Don't",
  warn: 'Not typically recommended',
};

@Component({
  selector: 'app-do-dont',
  templateUrl: 'do-dont.component.html',
  styleUrl: './do-dont.component.scss',
  imports: [CommonModule, ClrIconModule],
})
export class DoDontComponent {
  @Input() type: 'do' | 'dont' | 'warn' = 'do';
  @Input() isCard = false;
  @Input() caption = '';

  // optional
  @Input() heading: string | undefined;
  @Input() headingLevel: number | undefined;

  typeDisplayText = TYPE_DISPLAY_TEXT;

  constructor() {
    ClarityIcons.addIcons(checkIcon, timesIcon, warningStandardIcon);
  }
}

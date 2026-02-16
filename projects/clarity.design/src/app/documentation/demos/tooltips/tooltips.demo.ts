/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClarityIcons, infoCircleIcon } from '@cds/core/icon';

import { ClarityDocComponent } from '../clarity-doc';

const EXAMPLE = `
<clr-tooltip>
  <cds-icon clrTooltipTrigger shape="info-circle" size="24"></cds-icon>
  <clr-tooltip-content [clrPosition]="'top-right'" [clrSize]="'sm'">
    This is a basic tooltip
  </clr-tooltip-content>
</clr-tooltip>
`;

const EXAMPLE2 = `
<a href="..." role="tooltip" aria-haspopup="true" class="tooltip">
  <cds-icon shape="info-circle" size="24"></cds-icon>
  <span class="tooltip-content">Lorem</span>
</a>
`;

@Component({
  selector: 'clr-tooltips-demo',
  templateUrl: './tooltips.demo.html',
  styleUrl: './tooltips.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  standalone: false,
})
export class TooltipsDemo extends ClarityDocComponent {
  example = EXAMPLE;
  example2 = EXAMPLE2;
  constructor() {
    super('tooltip');
    ClarityIcons.addIcons(infoCircleIcon);
  }
}

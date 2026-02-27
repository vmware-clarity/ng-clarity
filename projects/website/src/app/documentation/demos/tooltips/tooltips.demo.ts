/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import {
  ClarityIcons,
  ClrIcon,
  ClrIconModule,
  ClrPopoverContent,
  ClrPopoverHostDirective,
  ClrStopEscapePropagationDirective,
  ClrTooltipModule,
  infoCircleIcon,
} from '@clr/angular';

import { TooltipsDirectionsDemo } from './tooltips-directions';
import { TooltipsSizesDemo } from './tooltips-sizes';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ClarityDocComponent } from '../clarity-doc';

const EXAMPLE = `
<clr-tooltip>
  <clr-icon clrTooltipTrigger shape="info-circle" size="24"></clr-icon>
  <clr-tooltip-content [clrPosition]="'top-right'" [clrSize]="'sm'">
    This is a basic tooltip
  </clr-tooltip-content>
</clr-tooltip>
`;

const EXAMPLE2 = `
<a href="..." role="tooltip" aria-haspopup="true" class="tooltip">
  <clr-icon shape="info-circle" size="24"></clr-icon>
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
  imports: [
    DocTabsComponent,
    DocTabComponent,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ClrTooltipModule,
    ClrIcon,
    ClrIconModule,
    ClrPopoverContent,
    StackblitzExampleComponent,
    TooltipsSizesDemo,
    TooltipsDirectionsDemo,
    StyleDocsComponent,
  ],
})
export class TooltipsDemo extends ClarityDocComponent {
  example = EXAMPLE;
  example2 = EXAMPLE2;
  constructor() {
    super('tooltip');
    ClarityIcons.addIcons(infoCircleIcon);
  }
}

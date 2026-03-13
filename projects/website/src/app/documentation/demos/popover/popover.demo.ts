/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClarityIcons, homeIcon, timesIcon } from '@clr/angular';

import { PopoverBasicDemo } from './popover-basic';
import { PopoverFallbackPositionsDemo } from './popover-fallback-positions';
import { PopoverPositionsDemo } from './popover-positions';
import { PopoverScrollToCloseDemo } from './popover-scroll-to-close';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-popover-demo',
  templateUrl: './popover.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    PopoverBasicDemo,
    PopoverPositionsDemo,
    PopoverFallbackPositionsDemo,
    PopoverScrollToCloseDemo,
  ],
})
export class PopoverDemo extends ClarityDocComponent {
  constructor() {
    super('popover');
    ClarityIcons.addIcons(homeIcon, timesIcon);
  }
}

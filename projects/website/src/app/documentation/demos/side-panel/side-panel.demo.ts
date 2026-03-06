/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SidePanelAngularAlternateCloseDemo } from './side-panel-angular-alt-close-demo';
import { SidePanelAngularDemo } from './side-panel-angular-demo';
import { SidePanelAngularInlineDemo } from './side-panel-angular-inline-demo';
import { SidePanelAngularPinnableDemo } from './side-panel-angular-pinnable-demo';
import { SidePanelAngularPinnedDemo } from './side-panel-angular-pinned-demo';
import { SidePanelAngularSizeDemo } from './side-panel-angular-size-demo';
import { SidePanelAngularStaticBackdropDemo } from './side-panel-angular-static-backdrop-demo';
import { SidePanelSizeDesignDemo } from './side-panel-size-design';
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-side-panel-demo',
  templateUrl: './side-panel.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    RouterLink,
    SidePanelAngularDemo,
    SidePanelAngularInlineDemo,
    SidePanelAngularPinnableDemo,
    SidePanelSizeDesignDemo,
    DoDontComponent,
    ThemedImageComponent,
    SidePanelAngularPinnedDemo,
    SidePanelAngularSizeDemo,
    SidePanelAngularStaticBackdropDemo,
    SidePanelAngularAlternateCloseDemo,
  ],
})
export class SidePanelDemo extends ClarityDocComponent {
  expanded = false;

  constructor() {
    super('side-panel');
  }
}

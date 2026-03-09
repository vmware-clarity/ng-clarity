/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ClarityIcons,
  cloudIcon,
  ClrAlertModule,
  ClrIcon,
  ClrIconModule,
  cogIcon,
  copyIcon,
  folderIcon,
  infoCircleIcon,
  vmBugIcon,
} from '@clr/angular';

import { LargeScreenNavDemo } from './large-screen-nav';
import { LayoutNoSubnavDemo } from './layout-no-subnav';
import { LayoutNoVerticalNavDemo } from './layout-no-vertical-nav';
import { LayoutOnlyHeaderDemo } from './layout-only-header';
import { LayoutSubnavPrimaryDemo } from './layout-subnav-primary';
import { LayoutVerticalNavPrimaryDemo } from './layout-vertical-nav-primary';
import { NavigationTypesDemo } from './navigation-types.demo';
import { ResponsiveNav1Demo } from './responsive-nav1';
import { ResponsiveNav2Demo } from './responsive-nav2';
import { SmallScreenNavDemo } from './small-screen-nav';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-navigation-demo',
  templateUrl: './navigation.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    LayoutNoVerticalNavDemo,
    LayoutNoSubnavDemo,
    LayoutOnlyHeaderDemo,
    LayoutVerticalNavPrimaryDemo,
    LayoutSubnavPrimaryDemo,
    RouterLink,
    ClrIcon,
    ClrIconModule,
    ClrAlertModule,
    ResponsiveNav1Demo,
    ResponsiveNav2Demo,
    ThemedImageComponent,
    NavigationTypesDemo,
    LargeScreenNavDemo,
    SmallScreenNavDemo,
  ],
})
export class NavigationDemo extends ClarityDocComponent {
  expanded = false;

  constructor() {
    super('navigation');
    ClarityIcons.addIcons(infoCircleIcon, vmBugIcon, copyIcon, cogIcon, cloudIcon, folderIcon);
  }
}

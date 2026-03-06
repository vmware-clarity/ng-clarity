/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { bookmarkIcon, ClarityIcons, ClrNavigationModule, ClrVerticalNavModule, objectsIcon } from '@clr/angular';

import { UrlIsExternalPipe } from './url-is-external.pipe';
import NAV from '../../../compiled-content/nav.json';
import COMPONENTS from '../../../settings/componentlist.json';

@Component({
  selector: 'app-site-nav',
  templateUrl: 'site-nav.component.html',
  host: {
    '[style.display]': "'flex'",
    '[style.width]': "'fit-content'",
  },
  imports: [CommonModule, RouterModule, ClrNavigationModule, ClrVerticalNavModule, UrlIsExternalPipe],
})
export class SiteNavComponent {
  navGroups = NAV['site-nav'];
  components = COMPONENTS.list;

  navExpandedState: Record<string, boolean> = {};

  constructor() {
    ClarityIcons.addIcons(bookmarkIcon, objectsIcon);
    const cache = localStorage.getItem('navExpandedCache');
    if (cache) {
      try {
        const state = JSON.parse(cache);
        this.navExpandedState = state;
      } catch {
        // Do nothing, defaults are set to open
      }
    }
  }

  cacheNavState(expanded: boolean, group: string) {
    this.navExpandedState[group] = expanded;
    localStorage.setItem('navExpandedCache', JSON.stringify(this.navExpandedState));
  }
}

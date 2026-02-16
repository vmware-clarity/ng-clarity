/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClarityIcons, cloudIcon, cogIcon, copyIcon, folderIcon, infoCircleIcon, vmBugIcon } from '@cds/core/icon';

import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-navigation-demo',
  templateUrl: './navigation.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  standalone: false,
})
export class NavigationDemo extends ClarityDocComponent {
  expanded = false;

  constructor() {
    super('navigation');
    ClarityIcons.addIcons(infoCircleIcon, vmBugIcon, copyIcon, cogIcon, cloudIcon, folderIcon);
  }
}

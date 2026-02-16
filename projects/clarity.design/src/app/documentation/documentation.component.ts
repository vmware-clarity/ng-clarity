/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { checkboxListIcon, ClarityIcons, cogIcon, helpInfoIcon, homeIcon, libraryIcon } from '@cds/core/icon';

import { SiteNavComponent } from '../shared/site-nav/site-nav.component';

@Component({
  selector: 'documentation',
  templateUrl: 'documentation.component.html',
  host: {
    '[class.content-container]': 'true',
  },
  imports: [RouterModule, SiteNavComponent],
})
export class DocumentationComponent {
  constructor() {
    ClarityIcons.addIcons(homeIcon, helpInfoIcon, checkboxListIcon, libraryIcon, cogIcon);
  }
}

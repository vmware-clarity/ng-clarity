/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClarityIcons, cogIcon, homeIcon, sunIcon, worldIcon } from '@cds/core/icon';

import { LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { ClarityDocComponent } from '../clarity-doc';
import { formsPatternLink } from '../pattern-links';

@Component({
  templateUrl: './breadcrumbs.demo.html',
  styleUrl: './breadcrumbs.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  standalone: false,
})
export class BreadcrumbsDemo extends ClarityDocComponent {
  readonly patternLinks: LinkCardsLink[] = [formsPatternLink];
  breadcrumbs = [
    { label: 'Framework', href: 'javascript://' },
    { label: 'Angular', href: 'javascript://' },
    { label: 'Clarity', href: 'javascript://' },
  ];

  breadcrumbsCollapsed = [
    { label: 'Home', href: 'javascript://' },
    { label: 'Framework', href: 'javascript://' },
    { label: 'Angular', href: 'javascript://' },
    { label: 'Clarity', href: 'javascript://' },
  ];

  constructor() {
    super('breadcrumbs');
    ClarityIcons.addIcons(cogIcon, homeIcon, worldIcon, sunIcon);
  }
}

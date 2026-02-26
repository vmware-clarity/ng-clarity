/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClarityIcons, ClrBreadcrumbsModule, cogIcon, homeIcon, sunIcon, worldIcon } from '@clr/angular';

import { BreadcrumbFullRoutingDemo } from './breadcrumbs-full-routing-example';
import { BreadcrumbHrefDemo } from './breadcrumbs-href-example';
import { BreadcrumbRoutingDemo } from './breadcrumbs-routing-example';
import { BreadcrumbsDemoModule } from './breadcrumbs.demo.module';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';
import { formsPatternLink } from '../pattern-links';

@Component({
  templateUrl: './breadcrumbs.demo.html',
  styleUrl: './breadcrumbs.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    ClrBreadcrumbsModule,
    ThemedImageComponent,
    BreadcrumbRoutingDemo,
    BreadcrumbFullRoutingDemo,
    BreadcrumbHrefDemo,
    StyleDocsComponent,
    BreadcrumbsDemoModule,
  ],
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

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';

@Component({
  templateUrl: './spacing.demo.html',
  styleUrl: './spacing.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [DocTabsComponent, DocTabComponent, ThemedImageComponent],
})
export class SpacingDemo extends ClarityDocComponent {
  readonly layoutSpaceTokens: { name: string; pxValue: number }[] = [
    { name: '--cds-global-layout-space-xxxs', pxValue: 2 },
    { name: '--cds-global-layout-space-xxs', pxValue: 4 },
    { name: '--cds-global-layout-space-xs', pxValue: 8 },
    { name: '--cds-global-layout-space-sm', pxValue: 12 },
    { name: '--cds-global-layout-space-md', pxValue: 16 },
    { name: '--cds-global-layout-space-lg', pxValue: 24 },
    { name: '--cds-global-layout-space-xl', pxValue: 32 },
    { name: '--cds-global-layout-space-xxl', pxValue: 48 },
    { name: '--cds-global-layout-space-xxxl', pxValue: 64 },
  ];

  readonly componentSpaceTokens: { name: string; pxValue: number }[] = [
    { name: '--cds-global-space-1', pxValue: 1 },
    { name: '--cds-global-space-2', pxValue: 2 },
    { name: '--cds-global-space-3', pxValue: 4 },
    { name: '--cds-global-space-4', pxValue: 6 },
    { name: '--cds-global-space-5', pxValue: 8 },
    { name: '--cds-global-space-6', pxValue: 12 },
    { name: '--cds-global-space-7', pxValue: 16 },
    { name: '--cds-global-space-8', pxValue: 18 },
    { name: '--cds-global-space-9', pxValue: 24 },
    { name: '--cds-global-space-10', pxValue: 32 },
    { name: '--cds-global-space-11', pxValue: 36 },
    { name: '--cds-global-space-12', pxValue: 48 },
    { name: '--cds-global-space-13', pxValue: 64 },
    { name: '--cds-global-space-14', pxValue: 72 },
    { name: '--cds-global-space-15', pxValue: 96 },
  ];

  constructor() {
    super('spacing');
  }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input, OnInit } from '@angular/core';
import {
  ClarityIcons,
  ClrIcon,
  loadChartIconSet,
  loadCommerceIconSet,
  loadCoreIconSet,
  loadEssentialIconSet,
  loadMediaIconSet,
  loadMiniIconSet,
  loadSocialIconSet,
  loadTechnologyIconSet,
  loadTextEditIconSet,
  loadTravelIconSet,
} from '@clr/angular';
import { GlobalStateService } from '@clr/angular/icon/services/global.service';

const ICON_COLLECTIONS: { name: string; load: () => void }[] = [
  { name: 'core', load: loadCoreIconSet },
  { name: 'essential', load: loadEssentialIconSet },
  { name: 'chart', load: loadChartIconSet },
  { name: 'commerce', load: loadCommerceIconSet },
  { name: 'media', load: loadMediaIconSet },
  { name: 'mini', load: loadMiniIconSet },
  { name: 'social', load: loadSocialIconSet },
  { name: 'technology', load: loadTechnologyIconSet },
  { name: 'text-edit', load: loadTextEditIconSet },
  { name: 'travel', load: loadTravelIconSet },
];

@Component({
  selector: 'storybook-icon-collection',
  standalone: true,
  imports: [ClrIcon],
  template: `
    <div cds-layout="vertical gap:sm">
      <p cds-text="section">{{ collectionName }} ({{ icons.length }})</p>
      <div class="icon-grid">
        @for (icon of icons; track icon) {
          <div class="icon-grid__item" [title]="icon">
            <cds-icon [shape]="icon" size="md" role="img" [attr.aria-label]="icon + ' icon'"></cds-icon>
            <span cds-text="smallcaption">{{ icon }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .icon-grid {
        display: flex;
        flex-wrap: wrap;
        gap: var(--cds-global-space-3);
      }
      .icon-grid__item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--cds-global-space-2);
        width: 80px;
        padding: var(--cds-global-space-3);
        border: var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);
        border-radius: var(--cds-alias-object-border-radius-100);
        word-break: break-all;
        text-align: center;
      }
    `,
  ],
})
export class IconCollectionStorybookComponent implements OnInit {
  @Input() collectionName = 'core';

  icons: string[] = [];

  ngOnInit() {
    // Resets icon registry to default
    GlobalStateService.resetCDSGlobal();
    const collection = ICON_COLLECTIONS.find(c => c.name === this.collectionName);
    collection?.load();
    this.icons = Object.keys(ClarityIcons.registry)
      .filter(name => name !== 'unknown')
      .sort();
  }
}

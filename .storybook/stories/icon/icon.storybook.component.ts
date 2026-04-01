/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgFor } from '@angular/common';
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

@Component({
  selector: 'storybook-all-icons',
  standalone: true,
  imports: [ClrIcon, NgFor],
  template: `
    <div cds-layout="horizontal gap:sm align:vertical-center" cds-layout="m-b:md">
      <input type="search" placeholder="Search icons..." class="clr-input" (input)="onSearch($event)" />
      <span cds-text="caption">{{ filteredIcons.length }} icons</span>
    </div>
    <div class="icon-grid">
      <div *ngFor="let icon of filteredIcons" class="icon-grid__item" [title]="icon">
        <cds-icon [shape]="icon" size="lg" role="img" [attr.aria-label]="icon + ' icon'"></cds-icon>
        <span cds-text="smallcaption">{{ icon }}</span>
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
export class AllIconsStorybookComponent implements OnInit {
  icons: string[] = [];
  filteredIcons: string[] = [];

  ngOnInit() {
    loadChartIconSet();
    loadCommerceIconSet();
    loadCoreIconSet();
    loadEssentialIconSet();
    loadMediaIconSet();
    loadMiniIconSet();
    loadSocialIconSet();
    loadTechnologyIconSet();
    loadTextEditIconSet();
    loadTravelIconSet();

    this.icons = Object.keys(ClarityIcons.registry)
      .filter(name => name !== 'unknown')
      .sort();
    this.filteredIcons = [...this.icons];
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredIcons = this.icons.filter(icon => icon.includes(query));
  }
}

const COLLECTIONS: { name: string; load: () => void }[] = [
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
  imports: [ClrIcon, NgFor],
  template: `
    <div cds-layout="vertical gap:sm">
      <p cds-text="section">{{ collectionName }} ({{ icons.length }})</p>
      <div class="icon-grid">
        <div *ngFor="let icon of icons" class="icon-grid__item" [title]="icon">
          <cds-icon [shape]="icon" size="md" role="img" [attr.aria-label]="icon + ' icon'"></cds-icon>
          <span cds-text="smallcaption">{{ icon }}</span>
        </div>
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
    const collection = COLLECTIONS.find(c => c.name === this.collectionName);
    collection?.load();
    this.icons = Object.keys(ClarityIcons.registry)
      .filter(name => name !== 'unknown')
      .sort();
  }
}

@Component({
  selector: 'storybook-all-collections',
  standalone: true,
  imports: [IconCollectionStorybookComponent, NgFor],
  template: `
    <div cds-layout="vertical gap:xl">
      <storybook-icon-collection *ngFor="let col of collections" [collectionName]="col"></storybook-icon-collection>
    </div>
  `,
})
export class AllCollectionsStorybookComponent {
  collections = COLLECTIONS.map(c => c.name);
}

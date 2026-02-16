/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { accessibility2Icon, ClarityIcons, colorPaletteIcon } from '@cds/core/icon';

import { LinkCardsLink } from '../../../../shared/link-cards/link-cards.component';

@Component({
  selector: 'app-charts-overview',
  templateUrl: './charts-overview.html',
  standalone: false,
})
export class ChartsOverview {
  readonly links: LinkCardsLink[] = [
    {
      routerLink: './colors',
      text: 'Usage of Colors',
      hexagonColor: 'sequential-blue',
      iconShape: 'color-palette',
    },
    {
      routerLink: './accessibility',
      text: 'Accessibility',
      hexagonColor: 'utility-tangerine',
      iconShape: 'accessibility-2',
    },
  ];

  constructor() {
    ClarityIcons.addIcons(colorPaletteIcon, accessibility2Icon);
  }
}
